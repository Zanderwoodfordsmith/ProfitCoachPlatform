"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";

const ONBOARDING_BULLETS = [
  "Lead with a specific prospect callout (type of business / role)—not a generic opener.",
  "Use “I ask because …” plus concrete proof with numbers; avoid abstract “we doubled profits” with no scale.",
  "End on interest in the outcome (“Is this of interest?”)—not interest in being coached.",
];

export function MessageGeneratorChat() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const chatStarted = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;

    setInput("");
    setError(null);
    const nextUser = { role: "user" as const, content: text };
    const historyForApi = [...messages, nextUser];
    setMessages(historyForApi);
    setStreaming(true);

    try {
      const res = await fetch("/api/message-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyForApi }),
      });

      if (!res.ok) {
        const errJson = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(errJson?.error ?? `Request failed (${res.status})`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let assistant = "";
      setMessages([...historyForApi, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistant += decoder.decode(value, { stream: true });
        setMessages([
          ...historyForApi,
          { role: "assistant", content: assistant },
        ]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setMessages((prev) => {
        if (
          prev.length >= 2 &&
          prev[prev.length - 1]?.role === "assistant" &&
          prev[prev.length - 1]?.content === ""
        ) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setStreaming(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  return (
    <div
      className={
        chatStarted
          ? "flex min-h-[calc(100dvh-3.5rem)] flex-1 flex-col overflow-hidden"
          : "flex flex-col gap-8 py-10"
      }
    >
      <header
        className={
          chatStarted
            ? "shrink-0 border-b border-zinc-200 bg-zinc-50 px-4 py-4 sm:px-6"
            : "mx-auto w-full max-w-2xl px-4 text-center sm:px-6"
        }
      >
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
          Message Generator
        </h1>
        <p
          className={
            chatStarted
              ? "mt-1 max-w-3xl text-sm text-zinc-600"
              : "mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-600"
          }
        >
          Describe what you need—connection note, follow-ups, or a full
          campaign. The assistant uses Profit Coach playbooks and real coach
          examples to explain, suggest options, and help you pick what fits your
          avatar.
        </p>
      </header>

      {!chatStarted ? (
        <div className="mx-auto w-full max-w-2xl flex-1 px-4 sm:px-6">
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-zinc-700">
              Patterns that move the needle
            </p>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-6 text-zinc-700">
              {ONBOARDING_BULLETS.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <label htmlFor="mg-input" className="sr-only">
              Your request
            </label>
            <textarea
              id="mg-input"
              rows={6}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="e.g. Help me write a connection message for UK manufacturing owners—I have client proof from a £400K to £1.5M turnaround…"
              disabled={streaming}
              className="min-h-[140px] w-full resize-y rounded-lg border border-zinc-200 bg-white px-4 py-3 text-[15px] leading-6 text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-200/80 disabled:opacity-60"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => void send()}
                disabled={streaming || !input.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {streaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Send className="h-4 w-4" aria-hidden />
                )}
                Send
              </button>
            </div>
            <p className="text-center text-[12px] text-zinc-500">
              Enter to send · Shift+Enter for a new line
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-5">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[90%] rounded-2xl rounded-br-md bg-blue-700 px-4 py-3 text-[15px] leading-6 text-white shadow-sm"
                      : "mr-auto max-w-[95%] rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-4 py-3 text-[15px] leading-6 text-zinc-800 shadow-sm"
                  }
                >
                  <div className="whitespace-pre-wrap break-words">
                    {m.content}
                    {m.role === "assistant" &&
                      streaming &&
                      i === messages.length - 1 && (
                        <span className="inline-block h-4 w-0.5 animate-pulse bg-zinc-400 align-middle" />
                      )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="shrink-0 border-t border-zinc-200 bg-zinc-100/90 px-4 py-4 backdrop-blur sm:px-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-3">
              {error ? (
                <p className="text-sm text-rose-700" role="alert">
                  {error}
                </p>
              ) : null}
              <textarea
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Reply or ask a follow-up…"
                disabled={streaming}
                className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-[15px] leading-6 text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-200/80 disabled:opacity-60"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => void send()}
                  disabled={streaming || !input.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {streaming ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Send className="h-4 w-4" aria-hidden />
                  )}
                  Send
                </button>
              </div>
              <p className="text-center text-[12px] text-zinc-500">
                Enter to send · Shift+Enter for a new line
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
