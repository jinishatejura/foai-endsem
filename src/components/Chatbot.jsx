import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessage } from '../utils/chatbot';

const MAX_MESSAGES = 30;
const STORAGE_KEY = 'chatbot_messages';

function loadMessages() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).slice(-MAX_MESSAGES) : [];
  } catch { return []; }
}

function saveMessages(msgs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-MAX_MESSAGES))); } catch {}
}

export default function Chatbot({ issData, newsArticles }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { saveMessages(messages); }, [messages]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;
    const userMsg = { role: 'user', content: text, time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
      const issContext = issData.currentPosition ? { latitude: issData.currentPosition.latitude, longitude: issData.currentPosition.longitude, speed: issData.currentSpeed, locationName: issData.locationName, positionCount: issData.positions.length, astronauts: issData.astronauts } : null;
      const reply = await sendMessage(text, issContext, newsArticles);
      setMessages(prev => [...prev, { role: 'bot', content: reply, time: new Date().toLocaleTimeString() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I encountered an error. Please try again.', time: new Date().toLocaleTimeString() }]);
    } finally { setIsTyping(false); }
  }, [input, isTyping, issData, newsArticles]);

  const clearChat = () => { setMessages([]); localStorage.removeItem(STORAGE_KEY); };

  return (
    <>
      <button className="chat-fab" onClick={() => setIsOpen(!isOpen)} id="chatbot-toggle" title="AI Chatbot">
        {isOpen ? '✕' : '🤖'}
      </button>
      {isOpen && (
        <div className="chat-window" id="chatbot-window">
          <div className="chat-header">
            <div className="chat-header-info"><span className="chat-avatar">🤖</span><div><strong>AI Assistant</strong><small>Powered by Mistral-7B</small></div></div>
            <button className="chat-clear" onClick={clearChat} title="Clear chat">🗑️</button>
          </div>
          <div className="chat-messages">
            {messages.length === 0 && <div className="chat-welcome"><p>👋 Hi! Ask me about:</p><ul><li>🛰️ ISS position & speed</li><li>👨‍🚀 People in space</li><li>📰 News summaries</li></ul></div>}
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg chat-msg-${m.role}`}>
                <div className="chat-bubble">{m.content}</div>
                <span className="chat-time">{m.time}</span>
              </div>
            ))}
            {isTyping && <div className="chat-msg chat-msg-bot"><div className="chat-bubble typing"><span className="dot"></span><span className="dot"></span><span className="dot"></span></div></div>}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-input-area" onSubmit={e => { e.preventDefault(); handleSend(); }}>
            <input type="text" className="chat-input" placeholder="Ask about ISS or news..." value={input} onChange={e => setInput(e.target.value)} id="chatbot-input" />
            <button type="submit" className="chat-send" disabled={isTyping || !input.trim()} id="chatbot-send">➤</button>
          </form>
        </div>
      )}
      <style>{`
        .chat-fab{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:var(--gradient-primary);color:#fff;font-size:1.5rem;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(108,99,255,.4);z-index:1000;transition:all .3s;border:none;cursor:pointer}.chat-fab:hover{transform:scale(1.1);box-shadow:0 6px 30px rgba(108,99,255,.6)}
        .chat-window{position:fixed;bottom:90px;right:24px;width:380px;max-height:520px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius-xl);box-shadow:var(--shadow-lg);z-index:1000;display:flex;flex-direction:column;animation:bounceIn .3s ease;overflow:hidden}
        .chat-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:var(--bg-card);border-bottom:1px solid var(--border-color)}.chat-header-info{display:flex;align-items:center;gap:10px}.chat-avatar{font-size:1.5rem}.chat-header-info strong{font-size:.9rem;color:var(--text-primary);display:block}.chat-header-info small{font-size:.65rem;color:var(--text-muted)}.chat-clear{background:none;border:none;font-size:1rem;cursor:pointer;padding:4px;opacity:.6;transition:opacity .2s}.chat-clear:hover{opacity:1}
        .chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;min-height:300px}
        .chat-welcome{text-align:center;color:var(--text-secondary);font-size:.85rem;padding:20px}.chat-welcome ul{list-style:none;margin-top:8px;display:flex;flex-direction:column;gap:4px}
        .chat-msg{display:flex;flex-direction:column;max-width:85%}.chat-msg-user{align-self:flex-end;align-items:flex-end}.chat-msg-bot{align-self:flex-start;align-items:flex-start}
        .chat-bubble{padding:10px 14px;border-radius:var(--radius-md);font-size:.85rem;line-height:1.5;word-wrap:break-word}.chat-msg-user .chat-bubble{background:var(--gradient-primary);color:#fff;border-bottom-right-radius:4px}.chat-msg-bot .chat-bubble{background:var(--bg-card);color:var(--text-primary);border:1px solid var(--border-color);border-bottom-left-radius:4px}
        .chat-time{font-size:.6rem;color:var(--text-muted);margin-top:2px;padding:0 4px}
        .typing{display:flex;gap:4px;padding:12px 16px}.dot{width:7px;height:7px;background:var(--text-muted);border-radius:50%;animation:dotBounce 1.4s infinite}.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
        .chat-input-area{display:flex;gap:8px;padding:12px;border-top:1px solid var(--border-color);background:var(--bg-card)}.chat-input{flex:1;padding:10px 14px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--bg-input);color:var(--text-primary);font-size:.85rem}.chat-input:focus{border-color:var(--accent-primary)}.chat-input::placeholder{color:var(--text-muted)}.chat-send{width:40px;height:40px;border-radius:var(--radius-md);background:var(--gradient-primary);color:#fff;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:all .2s;border:none;cursor:pointer}.chat-send:disabled{opacity:.4;cursor:not-allowed}.chat-send:not(:disabled):hover{transform:scale(1.05)}
        @media(max-width:480px){.chat-window{right:8px;left:8px;width:auto;bottom:84px;max-height:70vh}.chat-fab{bottom:16px;right:16px;width:50px;height:50px;font-size:1.3rem}}
      `}</style>
    </>
  );
}
