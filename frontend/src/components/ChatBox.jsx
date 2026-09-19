import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Trash2 } from 'lucide-react';
import aiService from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import './ChatBox.css';
 
const SUGGESTIONS = [
  'Is Paracetamol 500mg available?',
  'What is Paracetamol generally used for?',
  'Do you have Cetirizine?',
  'Show available allergy medicines.',
];
 
function ChatBox() {
  const { isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! Ask me about medicine availability, uses or general information.' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);
 
  const sendMessage = async (text) => {
    if (!text.trim()) return;
 
    if (!isLoggedIn) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', text },
        { role: 'bot', text: 'Please log in so I can check live availability for you.' },
      ]);
      setInput('');
      return;
    }
 
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setTyping(true);
 
    try {
      const data = await aiService.sendChatMessage(text);
      setMessages((prev) => [...prev, { role: 'bot', text: data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, I could not process that. Please try again.' }]);
    } finally {
      setTyping(false);
    }
  };
 
  const clearChat = () => {
    setMessages([{ role: 'bot', text: 'Chat cleared. How can I help you?' }]);
  };
 
  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(!open)} aria-label="AI Assistant">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
 
      {open && (
        <div className="chat-panel card">
          <div className="chat-header">
            <MessageCircle size={18} /> Pharma AI Assistant
            <span className="chat-online">● Online</span>
            <button className="chat-clear" onClick={clearChat} aria-label="Clear chat">
              <Trash2 size={16} />
            </button>
          </div>
 
          <div className="chat-body">
            {messages.map((m, i) => (
              <div className={`chat-bubble ${m.role}`} key={i}>{m.text}</div>
            ))}
            {typing && <div className="chat-bubble bot chat-typing">AI is thinking...</div>}
            <div ref={bottomRef} />
          </div>
 
          <div className="chat-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
 
          <form
            className="chat-input-row"
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          >
            <input
              type="text"
              placeholder="Ask about a medicine..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary chat-send" aria-label="Send">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
 
export default ChatBox;
 
