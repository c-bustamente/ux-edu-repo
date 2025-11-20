"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** Types */
type Author = "You" | "Instructor" | "TA";
interface ChatMsg {
  id: string;
  author: Author;
  text: string;
  tsISO: string;
  tag?: "rubric" | "deadline" | "link" | "general";
}

interface Presence {
  online: boolean;
  role: "Instructor" | "TA";
  officeHours: string; // display-only
  queue: number; // number of active student chats
}

const STORAGE_KEY = "uxedu.instructional.chat.v1";

/** Seed chat (education-focused) */
const SEED: ChatMsg[] = [
  {
    id: "m1",
    author: "Instructor",
    text:
      "Welcome to live course support. Share your question briefly. For broad topics, consider posting in the Forum.",
    tsISO: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    tag: "general",
  },
  {
    id: "m2",
    author: "You",
    text: "Hi! I need help understanding the rubric for Assignment 1.",
    tsISO: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    tag: "rubric",
  },
  {
    id: "m3",
    author: "TA",
    text:
      "Sure. The rubric checks Clarity, Evidence, and Actionability (see Assignments → A1 → Rubric). Which part is unclear?",
    tsISO: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    tag: "rubric",
  },
];

function timeSince(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.max(0, Math.floor(diff / 60000));
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function save(messages: ChatMsg[], presence: Presence) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, presence }));
  } catch {
    // ignore
  }
}
function load(): { messages: ChatMsg[]; presence: Presence } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        messages: SEED,
        presence: { online: true, role: "Instructor", officeHours: "Today 14:00–16:00", queue: 2 },
      };
    }
    const parsed = JSON.parse(raw) as { messages: ChatMsg[]; presence: Presence };
    return parsed;
  } catch {
    return {
      messages: SEED,
      presence: { online: true, role: "Instructor", officeHours: "Today 14:00–16:00", queue: 2 },
    };
  }
}

/** Quick replies oriented to instructional support */
const QUICK: Array<{ key: ChatMsg["tag"]; label: string; reply: string }> = [
  {
    key: "rubric",
    label: "Clarify rubric",
    reply:
      "Rubric highlights: 1) Clarity (plain language), 2) Evidence (screenshots/citations), 3) Actionability (specific fix). See Assignments → A1 → Rubric.",
  },
  {
    key: "deadline",
    label: "Deadline policy",
    reply:
      "Deadline: Sunday 23:59. Late window: 24h with -10%. If emergencies arise, message us here first, then post a note in the Forum thread.",
  },
  {
    key: "link",
    label: "Share resource link",
    reply:
      "Here’s the guide to acceptable evidence in critiques: #/docs/critique-evidence. Skim section ‘Before/After proposals’.",
  },
  {
    key: "general",
    label: "General help",
    reply:
      "Happy to help. In 1–2 lines, state your goal and where you got stuck. If it’s a broader topic, I’ll suggest moving the summary to the Forum.",
  },
];

/** Component */
export default function ExampleChatInstructional() {
  const [messages, setMessages] = useState<ChatMsg[]>(SEED);
  const [presence, setPresence] = useState<Presence>({
    online: true,
    role: "Instructor",
    officeHours: "Today 14:00–16:00",
    queue: 2,
  });
  const [text, setText] = useState<string>("");
  const [announce, setAnnounce] = useState<string>("");
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const { messages: m, presence: p } = load();
    setMessages(m);
    setPresence(p);
  }, []);

  useEffect(() => {
    save(messages, presence);
  }, [messages, presence]);

  useEffect(() => {
    // keep scrolled to bottom
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const statusLabel = useMemo(() => {
    if (!presence.online) return "Offline — leave a message";
    return `${presence.role} online • Office hours: ${presence.officeHours} • Queue: ${presence.queue}`;
  }, [presence]);

  function post(author: Author, body: string, tag: ChatMsg["tag"] = "general") {
    const msg: ChatMsg = {
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      author,
      text: body.trim(),
      tsISO: new Date().toISOString(),
      tag,
    };
    if (!msg.text) return;
    setMessages((prev) => [...prev, msg]);
    setAnnounce(`${author} posted a message.`);
  }

  function handleSend() {
    const body = text.trim();
    if (!body) return;
    post("You", body);
    setText("");
    // nudge visibility of system status
    setPresence((p) => ({ ...p, queue: Math.max(0, p.queue - 1) }));
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function quickReply(q: (typeof QUICK)[number]) {
    post("Instructor", q.reply, q.key);
  }

  async function escalateToForum() {
    const lastUser = [...messages].reverse().find((m) => m.author === "You");
    const draft =
      `Forum draft: ${lastUser ? `"${lastUser.text.slice(0, 120)}"` : "(no recent user message)"}\n` +
      `Context: converted from live chat — include screenshots and the rubric criterion you need clarified.`;
    try {
      await navigator.clipboard.writeText(draft);
      setAnnounce("Copied forum draft to clipboard.");
    } catch {
      // Fallback: add it into the chat so user can copy
      post("Instructor", draft, "general");
    }
  }

  function togglePresence() {
    // for demo: switch online/offline to show status changes
    setPresence((p) => ({ ...p, online: !p.online }));
  }

  return (
    <div className="w-full max-w-lg mx-auto" aria-labelledby="chat-title">
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <header className="mb-2">
          <h1 id="chat-title" className="text-lg font-semibold tracking-tight">Course Help Chat</h1>
          <p className="text-xs text-gray-600">Synchronous support for short, focused questions.</p>
        </header>

        {/* Presence & status */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] border ${
              presence.online
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-50 text-gray-700 border-gray-200"
            }`}
            aria-live="polite"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${presence.online ? "bg-green-500" : "bg-gray-400"}`}
              aria-hidden="true"
            />
            {statusLabel}
          </span>
          {/* tiny demo control to toggle status */}
          <button
            type="button"
            onClick={togglePresence}
            className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Toggle presence (demo)"
          >
            Toggle status
          </button>
        </div>

        {/* Messages */}
        <section className="mt-2 rounded-md border border-gray-100">
          <h2 className="sr-only">Messages</h2>
          <ul
            ref={listRef}
            className="max-h-64 overflow-auto p-2 space-y-2"
            role="log"
            aria-live="polite"
          >
            {messages.map((m) => (
              <li key={m.id} className="flex items-start gap-2">
                <div
                  className={`rounded-md px-3 py-2 max-w-[85%] text-sm ${
                    m.author === "You"
                      ? "bg-indigo-600 text-white ml-auto"
                      : "bg-gray-100 text-gray-900"
                  }`}
                  aria-label={`${m.author} says`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <p className={`mt-1 text-[11px] ${m.author === "You" ? "text-indigo-100" : "text-gray-600"}`}>
                    {m.author} • {timeSince(m.tsISO)}
                    {m.tag ? ` • ${m.tag}` : ""}
                  </p>
                </div>
              </li>
            ))}
            {messages.length === 0 && (
              <li className="text-sm text-gray-600 p-2">No messages yet. Say hello!</li>
            )}
          </ul>
        </section>

        {/* Quick instructional actions */}
        <div className="mt-2 flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q.key}
              type="button"
              onClick={() => quickReply(q)}
              className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={`Send quick reply: ${q.label}`}
            >
              {q.label}
            </button>
          ))}
          <button
            type="button"
            onClick={escalateToForum}
            className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs text-amber-800 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            Copy draft to Forum
          </button>
        </div>

        {/* Composer */}
        <form
          className="mt-2 space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          noValidate
        >
          <label className="block text-xs">
            <span className="sr-only">Type your message</span>
            <textarea
              ref={inputRef}
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a short question. Press Enter to send, Shift+Enter for a new line."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <div className="flex items-center justify-between">
            <p className="text-[11px] text-gray-600">
              Keep synchronous messages short. For complex issues, escalate to the Forum.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setText("")}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Clear
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Send
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Live region for announcements */}
      <div className="sr-only" aria-live="polite">{announce}</div>
    </div>
  );
}
