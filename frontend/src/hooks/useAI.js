import { useCallback, useState } from "react";
import { aiService } from "../services/aiService";

/** Conversation state for the assistant. No mocked replies, by design. */
export function useAI({ projectId } = {}) {
  const [messages, setMessages] = useState([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const send = useCallback(async (text) => {
    const outgoing = { role: "user", content: text, at: Date.now() };
    setMessages((m) => [...m, outgoing]);
    setPending(true);
    setError(null);
    try {
      const reply = await aiService.send({
        message: text,
        projectId,
        history: [...messages, outgoing].map(({ role, content }) => ({ role, content })),
      });
      setMessages((m) => [...m, { role: "assistant", content: reply?.message ?? reply?.content ?? "", refs: reply?.references ?? [], at: Date.now() }]);
    } catch (err) {
      setError(err);
    } finally {
      setPending(false);
    }
  }, [messages, projectId]);

  const retry = useCallback(() => {
    const last = [...messages].reverse().find((m) => m.role === "user");
    if (last) send(last.content);
  }, [messages, send]);

  return { messages, pending, error, send, retry };
}
