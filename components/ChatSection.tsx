"use client";

import { useState, useRef, useEffect } from "react";
import type { AnalyseResult } from "@/lib/claude";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSectionProps {
  result: AnalyseResult;
  texteDocument: string;
}

const SUGGESTIONS = [
  "Et si je ne réponds pas ?",
  "C'est grave ?",
  "J'ai besoin d'un délai, comment demander ?",
  "Quels sont mes droits ?",
];

export default function ChatSection({ result, texteDocument }: ChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function envoyer(question: string) {
    const q = question.trim();
    if (!q || loading) return;

    const userMsg: Message = { role: "user", content: q };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          analyse: result,
          texteDocument,
          historique: messages,
        }),
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.reponse ?? "Une erreur est survenue. Réessayez.",
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Une erreur est survenue. Réessayez." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border-soft bg-card overflow-hidden print:hidden">
      {/* Header */}
      <div className="border-b border-border-soft px-6 py-4">
        <h2 className="font-semibold text-white">Poser une question</h2>
        <p className="mt-0.5 text-sm text-muted">
          Posez vos questions sur ce document, je réponds en langage simple.
        </p>
      </div>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="max-h-96 overflow-y-auto px-6 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "dc-gradient-bg text-white rounded-br-none"
                    : "bg-white/10 text-white/90 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-2xl rounded-bl-none px-4 py-3">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted animate-bounce [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Suggestions — affichées uniquement au départ */}
      {messages.length === 0 && (
        <div className="px-6 pt-5 pb-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => envoyer(s)}
              disabled={loading}
              className="rounded-full border border-border-soft bg-ink px-4 py-2 text-sm text-white/80 transition hover:bg-white/5 hover:border-accent/50 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            envoyer(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question…"
            disabled={loading}
            className="flex-1 rounded-full border border-border-soft bg-ink px-4 py-2.5 text-sm text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="rounded-full dc-gradient-bg px-5 py-2.5 text-sm font-semibold tracking-[0.3px] text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Envoyer
          </button>
        </form>
      </div>
    </section>
  );
}
