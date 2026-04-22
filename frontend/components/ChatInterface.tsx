"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface ChatInterfaceProps {
  placementId: string;
}

export default function ChatInterface({ placementId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "I've analyzed the placement poster. Ask me anything about the eligibility, bonds, or salary details!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "What is the eligibility criteria?",
    "Is there any bond involved?",
    "What are the job locations?",
    "Tell me about the salary package."
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (content: string = input) => {
    if (!content.trim() || loading) return;

    const userMessage: Message = { role: "user", content };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/api/chat", { placementId, message: content });

      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel chat-container">
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--sidebar-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="logo-icon" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)' }}>
            <Bot size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#1e1b4b' }}>Placement Assistant</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981', fontWeight: '700' }}>
              <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }} />
              <span>AI Online</span>
            </div>
          </div>
        </div>
        <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', border: '1px solid var(--sidebar-border)' }}>
          GEMMA-2B
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.7 }}>
              {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                {msg.role === "assistant" ? "Assistant" : "You"}
              </span>
            </div>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="message assistant" style={{ background: '#f8fafc', border: '1px dashed var(--sidebar-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Loader2 size={16} className="animate-spin text-primary" />
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>Assistant is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="suggestion-chips">
          {suggestions.map((s, idx) => (
            <button key={idx} className="chip" onClick={() => handleSend(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            className="input-field"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="btn-primary"
            style={{ padding: '12px 18px' }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
