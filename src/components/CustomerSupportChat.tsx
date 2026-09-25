import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageSquare, X, Send, Sparkles, Shirt, Truck, HelpCircle, RotateCcw, Bot, MessageCircle, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SUPPORT_EMAIL, MERCHANT_DISPLAY_PHONE, getSupportWhatsAppUrl } from '../utils/whatsapp';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const CustomerSupportChat: React.FC = () => {
  const { isSupportChatOpen, setIsSupportChatOpen, orders } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'Greetings from ULEF.IN Atelier Concierge. How may I assist you with our heavyweight oversized collections today?',
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    { label: 'What is 240 GSM?', query: 'Can you explain what 240 GSM cotton means and why it matters for oversized drape?' },
    { label: 'Sizing Guide Help', query: 'How do ULEF.IN oversized t-shirts fit compared to standard tees?' },
    { label: 'Track Order Status', query: 'Can you check the shipping status for order ULF-89231?' },
    { label: 'Care & Washing Tips', query: 'How should I wash and care for heavyweight cotton to avoid collar warping?' },
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botReply = '';
      const lower = text.toLowerCase();

      if (lower.includes('gsm') || lower.includes('fabric') || lower.includes('weight')) {
        botReply = 'GSM stands for Grams per Square Meter. Standard t-shirts are flimsy 140–180 GSM. All ULEF.IN pieces use authentic 240 GSM compact combed cotton. This delivers a sculpted architectural silhouette, drop-shoulder structure, and zero see-through or clinging.';
      } else if (lower.includes('size') || lower.includes('fit') || lower.includes('oversized')) {
        botReply = 'Our cuts are engineered as true luxury oversized. If you prefer the signature boxy drop-shoulder aesthetic, order your normal size. If you prefer a more tailored standard look, size down one step. Check our 3D Size Matrix in the top bar!';
      } else if (lower.includes('order') || lower.includes('track') || lower.includes('ulf-') || lower.includes('shipping')) {
        const matchingOrder = orders[0];
        botReply = `Your recent order #${matchingOrder ? matchingOrder.id : 'ULF-89231'} is currently ${matchingOrder ? matchingOrder.status : 'Shipped'} via DHL Express (${matchingOrder ? matchingOrder.trackingNumber : 'TRK-902847291'}). Estimated delivery is in 2-3 business days.`;
      } else if (lower.includes('wash') || lower.includes('care') || lower.includes('collar')) {
        botReply = 'ULEF.IN tees are pre-shrunk. For maximum lifespan: machine wash cold (30°C / 85°F) inside out with mild detergent. Hang dry or lay flat. Avoid high-heat tumble drying. Our 1.25" double-ribbed collars feature elastane memory retention.';
      } else if (lower.includes('return') || lower.includes('exchange')) {
        botReply = `We offer complimentary 14-day global exchanges and returns on unworn items with original tags and presentation packaging. Visit our Orders Tracker, chat on WhatsApp (${MERCHANT_DISPLAY_PHONE}), or email ${SUPPORT_EMAIL} to generate a prepaid return label.`;
      } else {
        botReply = 'Thank you for contacting ULEF.IN Concierge. Our atelier team in Tokyo & Berlin crafts each piece in limited heavyweight runs. Let me know if you need specific styling combinations, lookbook references, or express checkout assistance!';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    }, 900);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsSupportChatOpen(!isSupportChatOpen)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-2xl border border-neutral-800 dark:border-neutral-200 hover:scale-105 active:scale-95 transition-all duration-300 group"
        aria-label="Customer Support Concierge"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-neutral-900 dark:ring-white animate-pulse" />
        </div>
        <span className="text-xs font-bold font-display uppercase tracking-wider hidden sm:inline">
          Atelier Concierge
        </span>
      </button>

      {/* Slide-Up Chat Drawer */}
      <AnimatePresence>
        {isSupportChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-20 left-4 sm:left-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-neutral-900 text-white rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col h-[520px] max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white">
                    ULEF.IN CONCIERGE
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Luxury Stylist & Support
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsSupportChatOpen(false)}
                className="w-7 h-7 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Contact Bar for Customer Support */}
            <div className="px-3 py-2 bg-neutral-950/90 border-b border-neutral-800 flex items-center justify-between gap-2 text-[11px] font-mono">
              <a
                href={getSupportWhatsAppUrl('Direct Chat Inquiry')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3 h-3 fill-white" />
                <span>WhatsApp: {MERCHANT_DISPLAY_PHONE}</span>
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold flex items-center gap-1 transition-colors"
                title={`Email: ${SUPPORT_EMAIL}`}
              >
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </a>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-900/90 text-xs">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-white text-neutral-950 rounded-br-none font-medium'
                        : 'bg-neutral-800 text-neutral-100 rounded-bl-none border border-neutral-700/60'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-neutral-800 text-neutral-400 w-16 border border-neutral-700/60">
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Inquiry Buttons */}
            <div className="p-2 bg-neutral-950/60 border-t border-neutral-800/80 overflow-x-auto no-scrollbar flex gap-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.query)}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 hover:text-white whitespace-nowrap transition-colors border border-neutral-700"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about GSM, fits, shipping..."
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputText.trim()}
                className="p-2 rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 disabled:opacity-40 transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
