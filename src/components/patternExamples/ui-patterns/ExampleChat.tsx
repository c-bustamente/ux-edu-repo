// =========================================================
// 3) src/components/pattern-examples/ExampleChat.tsx
//    Education-focused chat (course help room)
// =========================================================
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * ExampleChat — course help room
 * ---------------------------------------------------------
 * Why this design:
 * - Real-time feeling: typing indicator, slight delivery delay, read receipts.
 * - Edu context: roles (Student/Instructor), quick-suggest prompts, math/code blocks support via <pre>.
 * - Accessibility: role="log" with aria-live for new messages, focus management on send.
 * - Mobile friendly: input docked; Shift+Enter = newline, Enter = send.
 *
 * Replace MOCK_BOT with your backend (WebSocket/SSE).
 */

type Role = "student" | "instructor" | "assistant";
type Msg = {
  id: string;
  role: Role;
  author: string;
  text: string;
  whenISO: string;
  read?: boolean;
};

const nowISO = () => new Date().toISOString();

// Seed conversation (notice literal unions to avoid widening)
const INITIAL: Msg[] = [
  { id: "m1", role: "instructor", author: "Prof. Smith", text: "Welcome to Calculus 101 help chat. Ask anything about limits & derivatives.", whenISO: nowISO(), read: true },
  { id: "m2", role: "student",    author: "Ana",         text: "Hi! I’m stuck with chain rule when f(x)=sin(x^2).",                       whenISO: nowISO(), read: true },
  { id: "m3", role: "assistant",  author: "TA Bot",      text: "Tip: d/dx sin(u)=cos(u)·u'. For u=x^2, u'=2x → f'(x)=cos(x^2)·2x.",     whenISO: nowISO(), read: true },
];

const QUICK_PROMPTS = [
  "How do I study for tomorrow’s quiz?",
  "Can someone review my derivative steps?",
  "What’s the difference between product rule and chain rule?",
];

export default function ExampleChat() {
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState<null | { author: string; role: Role }>(null);
  const [sending, setSending] = useState(false);
  const [readAll, setReadAll] = useState(true);

  const logRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);

  // Mark as read when component visible (demo)
  useEffect(() => {
    if (readAll) return;
    const t = window.setTimeout(() => {
      setMessages(prev => prev.map(m => ({ ...m, read: true })));
      setReadAll(true);
    }, 800);
    return () => window.clearTimeout(t);
  }, [readAll]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSending(true);
    setReadAll(false);

    const mine: Msg = {
      id: `m-${Date.now()}`,
      role: "student",
      author: "You",
      text: trimmed,
      whenISO: nowISO(),
      read: false,
    };
    setMessages(prev => [...prev, mine]);
    setDraft("");

    // Simulate instructor/assistant reply
    mockBotReply(trimmed, (reply) => {
      setTyping({ author: reply.author, role: reply.role });
      setTimeout(() => {
        setMessages(prev => [...prev, reply]);
        setTyping(null);
        setSending(false);
      }, 900);
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(draft);
      // keep focus on input
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function insertPrompt(p: string) {
    setDraft(prev => (prev ? prev + "\n" + p : p));
    inputRef.current?.focus();
  }

  const groups = useMemo(() => groupByDay(messages), [messages]);

  return (
    <div className="w-full max-w-3xl rounded-xl border p-5 shadow-sm bg-white">
      <header className="mb-3 flex items-start gap-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Course Chat — Calculus 101</h3>
          <p className="text-sm text-muted-foreground">
            Real-time help with derivatives and limits. Be respectful and keep messages on-topic.
          </p>
        </div>
        <PresenceBadge online count={3} />
      </header>

      {/* Quick prompts */}
      <div className="mb-3 flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => insertPrompt(p)}
            className="rounded-full border px-3 py-1 text-xs bg-white hover:bg-gray-50"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Message log */}
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="h-96 overflow-y-auto rounded-lg border bg-gray-50 p-3"
      >
        {Object.entries(groups).map(([day, arr]) => (
          <section key={day} aria-label={day} className="mb-3">
            <div className="sticky top-0 z-10 -mx-3 bg-gray-50/80 px-3 py-1 text-center text-[11px] text-gray-500 backdrop-blur">
              {day}
            </div>
            <ul className="mt-2 space-y-2">
              {arr.map((m) => (
                <li key={m.id} className="flex items-start gap-2">
                  <Avatar role={m.role} name={m.author} />
                  <Bubble message={m} />
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="mt-2 flex items-start gap-2">
            <Avatar role={typing.role} name={typing.author} />
            <div className="max-w-[75%] rounded-2xl border bg-white px-3 py-2 text-sm shadow-sm">
              <Dots />
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="mt-3">
        <label className="sr-only" htmlFor="chat-input">Message</label>
        <div className="rounded-lg border bg-white">
          <textarea
            id="chat-input"
            ref={inputRef}
            className="block w-full resize-none rounded-t-lg p-3 text-sm outline-none"
            placeholder="Type a message…  (Enter to send, Shift+Enter for newline)"
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <div className="flex items-center justify-between border-t p-2">
            <div className="text-[11px] text-gray-500">Press Enter to send</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                onClick={() => setDraft("")}
                disabled={!draft}
              >
                Clear
              </button>
              <button
                type="button"
                className={[
                  "rounded-md px-3 py-1.5 text-sm",
                  draft.trim() && !sending ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-600 cursor-not-allowed",
                ].join(" ")}
                onClick={() => send(draft)}
                disabled={!draft.trim() || sending}
              >
                {sending ? "Sending…" : "Send"}
              </button>
            </div>
          </div>
        </div>
        {/* Read receipt (demo) */}
        <div className="mt-1 text-right text-xs text-gray-500">Read by instructor and 2 peers</div>
      </div>
    </div>
  );
}

/* ===========================================
   UI bits
=========================================== */

function PresenceBadge({ online, count }: { online: boolean; count: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs">
      <span className={`h-2.5 w-2.5 rounded-full ${online ? "bg-emerald-500" : "bg-gray-400"}`} />
      {count} online
    </div>
  );
}

function Avatar({ role, name }: { role: Role; name: string }) {
  const tone =
    role === "instructor" ? "bg-indigo-600"
    : role === "assistant" ? "bg-emerald-600"
    : "bg-gray-800";
  const initials = name.split(" ").map(p => p[0]).join("").slice(0,2).toUpperCase();
  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white text-xs ${tone}`} aria-hidden>
      {initials || "U"}
    </div>
  );
}

function Bubble({ message }: { message: Msg }) {
  const isMine = message.author === "You";
  const tone = isMine ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-200";
  return (
    <div className={`max-w-[75%] rounded-2xl border px-3 py-2 text-sm shadow-sm ${tone}`}>
      <div className="mb-0.5 flex items-center justify-between gap-3">
        <span className="font-medium">{message.author}</span>
        <span className="text-[10px] text-gray-500/80">{formatTime(message.whenISO)}</span>
      </div>
      <RichText text={message.text} />
      {isMine && (
        <div className="mt-1 text-[10px] text-gray-300">
          {message.read ? "Read" : "Sent"}
        </div>
      )}
    </div>
  );
}

// Minimal “rich” rendering: backticks → code, triple backticks block, $$ math block (rendered monospace)
function RichText({ text }: { text: string }) {
  // quick pass for ```code``` blocks
  if (text.includes("```")) {
    const parts = text.split(/```/);
    return (
      <div className="space-y-2">
        {parts.map((p, i) =>
          i % 2 === 1 ? (
            <pre key={i} className="whitespace-pre-wrap rounded-md bg-gray-100 p-2 text-xs text-gray-800">{p}</pre>
          ) : (
            <p key={i} className="whitespace-pre-wrap">{inlineCode(p)}</p>
          )
        )}
      </div>
    );
  }
  // $$…$$ as block (monospace)

  if (text.includes("$$")) {
    const parts = text.split("$$");
    return (
      <div className="space-y-2">
        {parts.map((p, i) =>
          i % 2 === 1 ? (
            <pre key={i} className="rounded-md bg-gray-100 p-2 text-xs text-gray-800">{p}</pre>
          ) : (
            <p key={i} className="whitespace-pre-wrap">{inlineCode(p)}</p>
          )
        )}
      </div>
    );
  }

  return <p className="whitespace-pre-wrap">{inlineCode(text)}</p>;
}

function inlineCode(s: string) {
  // `code` → <code>
  const segs = s.split(/`/);
  return (
    <>
      {segs.map((seg, i) =>
        i % 2 === 1 ? (
          <code key={i} className="rounded bg-gray-100 px-1 py-0.5 text-[12px] text-gray-800">{seg}</code>
        ) : (
          <span key={i}>{seg}</span>
        )
      )}
    </>
  );
}

function Dots() {
  return (
    <div className="flex gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.2s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.1s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-600" />
    </div>
  );
}

/* ===========================================
   Bot mock (replace with backend)
=========================================== */

function mockBotReply(userText: string, cb: (msg: Msg) => void) {
  const lower = userText.toLowerCase();
  // Tiny intent router for demo
  if (lower.includes("chain rule")) {
    cb({
      id: `m-bot-${Date.now()}`,
      role: "assistant",
      author: "TA Bot",
      text: [
        "Try this:",
        "```",
        "If f(x) = sin(x^2), let u=x^2 → du/dx=2x.",
        "Then f'(x) = cos(u)·du/dx = cos(x^2)·2x.",
        "```",
        "Want a practice set?",
      ].join("\n"),
      whenISO: nowISO(),
      read: true,
    });
  } else if (lower.includes("study") || lower.includes("quiz")) {
    cb({
      id: `m-bot-${Date.now()}`,
      role: "assistant",
      author: "TA Bot",
      text:
        "- Focus: definition of limit, derivative rules, tangent line.\n" +
        "- Do 8–10 mixed problems.\n" +
        "- Skim notes; teach a friend the steps aloud.",
      whenISO: nowISO(),
      read: true,
    });
  } else {
    cb({
      id: `m-bot-${Date.now()}`,
      role: "instructor",
      author: "Prof. Smith",
      text: "Thanks for the question. Can you share your steps up to the point where you get stuck?",
      whenISO: nowISO(),
      read: true,
    });
  }
}

/* ===========================================
   Tiny utils
=========================================== */
function groupByDay(list: Msg[]) {
  const out: Record<string, Msg[]> = {};
  for (const m of list) {
    const d = new Date(m.whenISO);
    const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    (out[label] ||= []).push(m);
  }
  return out;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}
