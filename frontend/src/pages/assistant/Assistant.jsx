import { useState } from "react";
import { Sparkles, Send, Bot, User, Trash2 } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import { api } from "../../services/apiClient";

export default function Assistant() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const getClientFallbackAnswer = (text) => {
    const q = text.toLowerCase().trim();
    if (["hi", "hii", "hello", "hey", "greetings"].some((k) => q.includes(k))) {
      return "👋 **Hello! Welcome to Pragati AI Decision Assistant**.\n\nI am your civil engineering, blueprint design, and national infrastructure portfolio copilot.\n\nHow can I help you today? Ask me about designing house blueprints (`/blueprint`), contractor trust ratings (`/contractors`), high-risk projects, or cost escalation forecasts!";
    }
    if (q.includes("blueprint") || q.includes("house") || q.includes("floor plan")) {
      return "📐 **House Blueprint & Floor Plan Guidance**:\n\n1. **Living Room**: 14' × 18' or 16' × 20'\n2. **Master Bedroom**: 14' × 16' (with 5' × 8' attached bath)\n3. **Kitchen**: 10' × 12' (South-East orientation as per Vastu)\n\n👉 Use Pragati AI's interactive **'AI Blueprint Studio'** (`/blueprint`) to generate 2D CAD layouts and Bill of Quantities (BOQ)!";
    }
    return "📊 **Pragati AI Decision Support**:\n\nI have scanned the monitored infrastructure portfolio. You can inquire about:\n• High-risk project corridors & delay alerts\n• Contractor trust scores & on-time performance (`/contractors`)\n• Cost escalation sensitivity analysis (`/cost-escalation`)\n• Custom house blueprints and structural BOQ (`/blueprint`)";
  };

  const sendMessage = async (customPrompt) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim()) return;

    const userMessage = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setPrompt("");
    setLoading(true);

    try {
      let response;
      try {
        response = await api.post("/api/assistant/query", {
          message: textToSend,
          prompt: textToSend,
        });
      } catch (err) {
        response = await api.post("/api/assistant/chat", {
          message: textToSend,
          prompt: textToSend,
        });
      }

      const botMessage = {
        role: "assistant",
        content: response?.answer || getClientFallbackAnswer(textToSend),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Assistant query error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: getClientFallbackAnswer(textToSend),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Design 30x40 East facing 3BHK house blueprint",
    "Which projects have critical risk in MoSPI?",
    "Show me contractor trust rating summary",
    "Predict cost escalation for National Highways",
  ];

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader
        title="Pragati AI Assistant"
        subtitle="Conversational civil engineering, architectural floor plans, and national infrastructure portfolio intelligence."
      />

      <Card className="flex min-h-[640px] flex-col overflow-hidden border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
        <div className="border-b border-white/[0.06] bg-white/[0.02] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange/15 border border-orange/30 text-orange font-bold shadow-sm">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-[14.5px] font-bold text-ink flex items-center gap-2">
                Pragati AI Decision Assistant
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />
              </h2>
              <p className="text-[11px] text-muted font-mono">
                Multimodal Civil & Infrastructure AI • Online
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="inline-flex items-center gap-1.5 text-[12px] text-muted hover:text-red-400 font-semibold px-3 py-1.5 rounded-xl border border-white/[0.06] bg-white/[0.04] hover:bg-white/[0.08] transition"
            >
              <Trash2 size={13} />
              Clear Thread
            </button>
          )}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-black/20 p-6">
          {messages.length === 0 && (
            <div className="mx-auto max-w-xl py-14 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange/15 border border-orange/30 text-orange text-xl font-bold mb-3">
                <Sparkles size={24} />
              </div>
              <h3 className="text-lg font-bold text-ink tracking-tight">
                How can Pragati AI assist you today?
              </h3>
              <p className="mt-2 text-[12.5px] text-muted max-w-md mx-auto leading-relaxed">
                Ask about designing house blueprints, contractor trust ratings, national mega-project cost escalations, or delay early warnings.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    onClick={() => sendMessage(item)}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-[12px] font-medium text-ink transition hover:border-orange/50 hover:bg-white/[0.08]"
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
              className={`flex items-start gap-3 ${
                item.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {item.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange/15 border border-orange/30 text-orange">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed whitespace-pre-line shadow-sm ${
                  item.role === "user"
                    ? "bg-orange text-white rounded-br-xs font-medium"
                    : "border border-white/[0.08] bg-white/[0.05] text-ink rounded-bl-xs"
                }`}
              >
                {item.content}
              </div>

              {item.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] border border-white/[0.1] text-ink">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange/15 border border-orange/30 text-orange">
                <Sparkles size={16} className="animate-spin" />
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-[12.5px] text-muted font-mono">
                Pragati AI is processing telemetry & querying ML models…
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/[0.06] bg-white/[0.02] p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Pragati AI about projects, blueprints, risks or contractors..."
              className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 text-[13px] text-ink placeholder:text-muted focus:border-orange/50 focus:outline-none transition-all"
            />

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="inline-flex h-[42px] items-center justify-center gap-2 rounded-xl bg-orange px-5 text-[13px] font-semibold text-white shadow-submit hover:bg-orange-light transition disabled:opacity-40"
            >
              <Send size={15} />
              Send
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}