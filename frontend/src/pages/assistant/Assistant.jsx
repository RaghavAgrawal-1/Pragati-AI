import { useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import { api } from "../../services/apiClient";

export default function Assistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text = message) => {
    const question = text.trim();
    if (!question || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: question },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const result = await api.post("/api/assistant/chat", {
        message: question,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.answer },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "How to build a blueprint of house?",
    "Which projects are high risk?",
    "Which projects have cost overruns?",
    "Find top verified contractors",
    "Give me a portfolio summary",
  ];

  return (
    <>
      <PageHeader
        title="Pragati AI Assistant"
        subtitle="Conversational civil engineering, architectural floor plans, and national infrastructure portfolio intelligence."
      />

      <Card className="flex min-h-[640px] flex-col overflow-hidden border border-slate-200/90 shadow-sm">
        <div className="border-b border-slate-200/80 bg-slate-50/70 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-amber-400 font-bold shadow-sm">
              ✦
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Pragati AI Decision Assistant
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                Multimodal Civil & Infrastructure AI • Online
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded hover:bg-slate-200/60 transition"
            >
              Clear Thread
            </button>
          )}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/40 p-6">
          {messages.length === 0 && (
            <div className="mx-auto max-w-xl py-14 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm text-amber-500 text-xl font-bold mb-3">
                ✦
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                How can Pragati AI assist you today?
              </h3>
              <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Ask about designing house blueprints, contractor trust ratings, national mega-project cost escalations, or delay early warnings.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    onClick={() => sendMessage(item)}
                    className="rounded-lg border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:border-[var(--infra-primary)] hover:bg-slate-50 hover:shadow-sm"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((item, index) => (
            <div
              key={index}
              className={`flex ${
                item.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                  item.role === "user"
                    ? "bg-slate-900 text-white rounded-br-sm font-normal"
                    : "border border-slate-200/90 bg-white text-slate-800 rounded-bl-sm"
                }`}
              >
                {item.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-500 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[var(--infra-primary)] animate-ping" />
                Analyzing engineering parameters & formulating response...
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white p-4">
          <div className="flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Ask about house blueprints, project risks, contractors, or delays..."
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[var(--infra-primary)] transition"
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading || !message.trim()}
              className="rounded-xl bg-[var(--infra-primary)] px-6 py-3 text-sm font-bold text-slate-950 transition hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
            >
              Ask
            </button>
          </div>
        </div>
      </Card>
    </>
  );
}