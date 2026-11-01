import Anthropic from "@anthropic-ai/sdk";
import { company } from "@/data/site";
import { sendTeamEmail } from "@/lib/email";
import { EASY_READ_OFF, EASY_READ_ON, SYSTEM_PROMPT } from "@/lib/assistant/knowledge";

/**
 * Streams answers from the website's AI assistant ("Charis") as newline-delimited JSON events:
 *   {t:"text", d}            a piece of the reply
 *   {t:"tool", state}        the call-back tool started / finished / failed
 *   {t:"turn", messages}     the messages to append to the visitor's history (append-only)
 *   {t:"error", message}
 *
 * The browser keeps the conversation and sends it back unchanged each turn, so the model's
 * thinking blocks stay valid between turns ("preserved thinking"); nothing here edits history.
 *
 * Needs ANTHROPIC_API_KEY. Without it the assistant replies with the team's contact details.
 */

export const maxDuration = 60;

type Msg = Anthropic.Beta.BetaMessageParam;
type Event =
  | { t: "text"; d: string }
  | { t: "tool"; state: "start" | "done" | "error" }
  | { t: "turn"; messages: Msg[] }
  | { t: "error"; message: string };

const MODEL = process.env.ASSISTANT_MODEL ?? "claude-opus-5-5";
// Server-side refusal fallback ("default" routing) is available on these models only.
const FALLBACK_MODELS = new Set(["claude-opus-5-5", "claude-opus-5", "claude-sonnet-5-5", "claude-fable-5-1"]);
const MAX_ITERATIONS = 4;
const MAX_TEXT = 2000;
const MAX_HISTORY = 80;
const MAX_HISTORY_BYTES = 400_000;

const FALLBACK_REPLY = `Thanks for your message! Our online assistant isn't available right now, but our friendly team would love to help. Call us on **${company.phone.display}**, email [${company.email}](mailto:${company.email}), or send a message through our [contact form](/contact/).`;

const tools: Anthropic.Beta.BetaTool[] = [
  {
    name: "request_callback",
    description:
      "Send the visitor's call-back request to the Charismatic Care team, who will phone them. Only use this after the visitor has given at least their name and phone number and has clearly confirmed the details you read back to them.",
    eager_input_streaming: true,
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "The visitor's name." },
        phone: { type: "string", description: "UK phone number to call back on." },
        email: { type: "string", description: "Email address, if the visitor gave one." },
        area: { type: "string", description: "Town or area the visitor lives in, if given." },
        preferred_time: { type: "string", description: "When they would like to be called, if given." },
        topic: { type: "string", description: "One or two sentences on what the call is about, in the visitor's own terms." },
      },
      required: ["name", "phone", "topic"],
    },
  },
];

// Best-effort, per-instance limits to keep a public endpoint from being abused.
const hits = new Map<string, number[]>();
function rateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > limit;
}

type CallbackInput = { name: string; phone: string; email?: string; area?: string; preferred_time?: string; topic: string };

/** The streamed tool input is not validated by the API, so check it before acting on it. */
function parseCallback(input: unknown): CallbackInput | null {
  if (!input || typeof input !== "object") return null;
  const i = input as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === "string" && v.trim().length > 0 && v.length <= max ? v.trim() : undefined);
  const name = str(i.name, 120);
  const phone = str(i.phone, 30);
  const topic = str(i.topic, 1000);
  if (!name || !phone || !topic) return null;
  if ((phone.match(/\d/g) ?? []).length < 9 || !/^[\d\s()+-]+$/.test(phone)) return null;
  const email = str(i.email, 200);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return { name, phone, topic, email, area: str(i.area, 200), preferred_time: str(i.preferred_time, 200) };
}

/** Accept only the shapes this chat produces: text and tool results from the visitor, plain system notes. */
function validHistory(history: unknown): history is Msg[] {
  if (!Array.isArray(history) || history.length > MAX_HISTORY) return false;
  if (JSON.stringify(history).length > MAX_HISTORY_BYTES) return false;
  return history.every((m) => {
    if (!m || typeof m !== "object") return false;
    if (m.role === "assistant") return typeof m.content === "string" || Array.isArray(m.content);
    if (m.role === "system") return typeof m.content === "string";
    if (m.role !== "user") return false;
    if (typeof m.content === "string") return true;
    return (
      Array.isArray(m.content) &&
      m.content.every(
        (b: { type?: string; content?: unknown }) => b?.type === "text" || (b?.type === "tool_result" && typeof b.content === "string"),
      )
    );
  });
}

export async function POST(request: Request) {
  let body: { history?: unknown; text?: unknown; easyRead?: unknown; easyReadChanged?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  const history = body.history ?? [];
  if (!text || text.length > MAX_TEXT || !validHistory(history)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(`chat:${ip}`, 30, 10 * 60_000)) {
    return Response.json({ error: `You're sending messages very quickly. Please wait a moment, or call us on ${company.phone.display}.` }, { status: 429 });
  }

  // The new turn: the visitor's message, plus an Easy Read note if they just switched it on or off.
  const turn: Msg[] = [{ role: "user", content: text }];
  if (body.easyReadChanged === true) {
    turn.push({ role: "system", content: body.easyRead === true ? EASY_READ_ON : EASY_READ_OFF });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: Event) => controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"));

      try {
        if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
          for (const word of FALLBACK_REPLY.split(/(?<= )/)) {
            send({ t: "text", d: word });
            await new Promise((r) => setTimeout(r, 18));
          }
          send({ t: "turn", messages: [] });
          return;
        }

        await runAssistant([...(history as Msg[]), ...turn], turn, send, ip, request.signal);
      } catch (err) {
        if (!request.signal.aborted) {
          console.error("[assistant]", err);
          const busy = err instanceof Anthropic.RateLimitError || (err instanceof Anthropic.APIError && err.status === 529);
          const message = busy
              ? "I'm a little busy right now — please try again in a moment."
              : `Sorry, something went wrong on my side. Please try again, or call us on ${company.phone.display}.`;
          send({ t: "error", message });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}

async function runAssistant(messages: Msg[], turn: Msg[], send: (e: Event) => void, ip: string, signal: AbortSignal) {
  const client = new Anthropic();
  const betas: Anthropic.Beta.AnthropicBeta[] = ["thinking-binding-controls-2026-08-01"];
  const useFallbacks = FALLBACK_MODELS.has(MODEL);
  if (useFallbacks) betas.push("server-side-fallback-2026-07-01");

  let jsonRetries = 0;
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const stream = client.beta.messages.stream(
      {
        model: MODEL,
        max_tokens: 8000,
        betas,
        ...(useFallbacks ? { fallbacks: "default" as const } : {}),
        // Chat replies are short and latency matters: low effort keeps thinking brief.
        output_config: { effort: "low" },
        // If an earlier turn's reasoning can't be reused, drop it rather than failing the chat.
        thinking: { type: "adaptive", block_binding: { prefix_mismatch_behavior: "drop_block" } },
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        cache_control: { type: "ephemeral" },
        tools,
        messages,
      },
      { signal },
    );
    stream.on("text", (d) => send({ t: "text", d }));

    let message: Anthropic.Beta.BetaMessage;
    try {
      message = await stream.finalMessage();
      jsonRetries = 0;
    } catch (err) {
      // Only an unparseable streamed tool input is retried; API errors go to the caller.
      if (err instanceof Anthropic.APIError || signal.aborted || jsonRetries++ >= 1) throw err;
      continue;
    }

    if (message.stop_reason === "refusal") {
      send({ t: "text", d: `I'm sorry — I can't help with that here. Our team is happy to talk on **${company.phone.display}**.` });
      // Nothing from a declined turn is kept, so the next message starts from the last good state.
      send({ t: "turn", messages: [] });
      return;
    }

    const toolUses = message.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
    const assistantMsg: Msg = { role: "assistant", content: message.content };

    if (toolUses.length === 0) {
      turn.push(assistantMsg);
      send({ t: "turn", messages: turn });
      return;
    }
    // A tool call cut off by max_tokens may carry truncated input: don't run it or keep it.
    if (message.stop_reason === "max_tokens") {
      send({ t: "text", d: `

Sorry, I couldn't finish that. Please try again, or call us on **${company.phone.display}**.` });
      send({ t: "turn", messages: [] });
      return;
    }

    messages.push(assistantMsg);
    turn.push(assistantMsg);

    const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
    for (const use of toolUses) {
      results.push({ type: "tool_result", tool_use_id: use.id, ...(await runTool(use, send, ip)) });
    }
    const toolMsg: Msg = { role: "user", content: results };
    messages.push(toolMsg);
    turn.push(toolMsg);
  }

  send({ t: "text", d: `\n\nSorry, I couldn't finish that. Please call us on **${company.phone.display}**.` });
  send({ t: "turn", messages: [] });
}

async function runTool(use: Anthropic.Beta.BetaToolUseBlock, send: (e: Event) => void, ip: string): Promise<{ content: string; is_error?: boolean }> {
  if (use.name !== "request_callback") return { content: `Unknown tool: ${use.name}`, is_error: true };

  const input = parseCallback(use.input);
  if (!input) {
    return { content: "The details were incomplete or invalid (a name, a valid UK phone number and a topic are required). Ask the visitor to check them.", is_error: true };
  }
  if (rateLimited(`callback:${ip}`, 3, 60 * 60_000)) {
    return { content: `Too many call-back requests from this visitor. Ask them to call ${company.phone.display} instead.`, is_error: true };
  }

  send({ t: "tool", state: "start" });
  const lines = [
    "Call-back request from the website assistant",
    "",
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    input.email && `Email: ${input.email}`,
    input.area && `Area: ${input.area}`,
    input.preferred_time && `Best time to call: ${input.preferred_time}`,
    "",
    `About: ${input.topic}`,
  ].filter((l) => l !== undefined);
  const ok = await sendTeamEmail({ subject: `Call-back request — ${input.name}`, text: lines.join("\n"), replyTo: input.email });
  send({ t: "tool", state: ok ? "done" : "error" });

  return ok
    ? { content: "Call-back request sent to the team successfully." }
    : { content: `Sending failed. Apologise and give the phone number ${company.phone.display} and email ${company.email}.`, is_error: true };
}
