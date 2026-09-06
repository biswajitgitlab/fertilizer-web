import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { QuickReplies } from './QuickReplies';
import { ChatMessage } from '../../types';
import { chatApi } from '../../api/chatApi';
import { AnimatedSparkles, AnimatedCropDoctor } from '../common/AnimatedIcons';
import { useCart } from '../../hooks/useCart';

export const ChatWidget: React.FC = () => {
  const location = useLocation();
  const { chatOpen, toggleChat, setChatOpen, sidebarOpen, notifOpen, cartBannerDismissed } = useUIStore();
  const { itemCount, isOpen: isCartDrawerOpen } = useCart();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: "Namaste! I am KrishiMitra, your digital farming & fertilizer assistant. Ask me anything about NPK dosage, insecticides, weed killers, or your orders!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Responsive mobile detector
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && chatOpen) {
        setChatOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chatOpen, setChatOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClearChat = async () => {
    await chatApi.startSession();
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: "bot",
        text: "Chat history cleared! How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  useEffect(() => {
    if (chatOpen) {
      scrollToBottom();
      // On desktop, autofocus the input
      if (!isMobile) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [messages, chatOpen, isMobile]);

  const handleSendMessage = async (textToSend?: string) => {
    if (isTyping) return;
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const response = await chatApi.sendMessage(text);
      setMessages((prev) => [
        ...prev,
        {
          id: response.id || `bot-${Date.now()}`,
          sender: "bot",
          text: response.text,
          timestamp: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (e: any) {
      const errText = e?.response?.status === 429
        ? "Too many chat messages sent! Please wait 1 minute before asking more questions."
        : "I am having trouble connecting right now, but you can explore our products or call toll-free 1800-888-FARM!";

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: errText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // E-commerce Best Practices:
  // 1. Distraction-Free Conversion Funnel: Hide completely on checkout, cart, auth, and admin routes
  const isSuppressedRoute = 
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password';

  // 2. Hide floating launcher when any major header action / overlay is active (e.g. mobile navigation drawer, cart drawer, or notification panel)
  const isHeaderActionOpen = Boolean(sidebarOpen || isCartDrawerOpen || notifOpen);

  // Close chat automatically if user opens a major drawer like the mobile menu or cart
  useEffect(() => {
    if (isHeaderActionOpen && chatOpen) {
      setChatOpen(false);
    }
  }, [isHeaderActionOpen, chatOpen, setChatOpen]);

  // Compute mobile bottom clearance:
  // When cart banner is active (itemCount > 0, !cartBannerDismissed, !isCartDrawerOpen),
  // FloatingCartBanner is at bottom-[74px] (height ~60px, top ~134px).
  // bottom-[148px] clears it cleanly with a 14px buffer, away from the "View Cart ->" button.
  // When cart banner is inactive or dismissed, MobileBottomNav is at bottom-0 (height ~60px).
  // bottom-[76px] clears it cleanly with a 16px buffer.
  const isCartBannerActive = itemCount > 0 && !cartBannerDismissed && !isCartDrawerOpen;
  const mobileBottomPosition = isCartBannerActive ? 'bottom-[148px]' : 'bottom-[76px]';

  // If on checkout, cart, auth, or admin, do not render the assistant widget at all
  if (isSuppressedRoute || typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* ──────────────────────────────────────────────────────────
          1. FLOATING LAUNCHER TRIGGER BUTTON
          ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!chatOpen && !isHeaderActionOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`fixed right-4 sm:right-6 z-[90] ${mobileBottomPosition} sm:bottom-6 transition-[bottom] duration-300 pointer-events-auto select-none`}
          >
            <motion.button
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleChat}
              className="group relative flex items-center justify-center sm:justify-start gap-2.5 h-12 w-12 sm:h-auto sm:w-auto p-0 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white shadow-[0_8px_30px_rgba(16,185,129,0.45)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.6)] border border-white/30 dark:border-emerald-400/40 backdrop-blur-md cursor-pointer transition-shadow"
              aria-label="Ask KrishiMitra AI Assistant"
            >
              {/* Subtle ambient glow behind button */}
              <div className="absolute inset-0 rounded-full bg-emerald-400/25 blur-md group-hover:bg-emerald-400/40 transition-all pointer-events-none -z-10" />

              {/* Mobile "AI" floating badge on top-right */}
              <span className="sm:hidden absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[9px] px-1 py-0.5 rounded-full shadow-sm border border-white dark:border-slate-900 leading-none">
                AI
              </span>

              {/* Icon Avatar with Online Status Indicator */}
              <div className="relative shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 dark:bg-slate-950/40 border border-white/30 text-white shadow-inner">
                <AnimatedCropDoctor size={20} className="text-white drop-shadow-xs" />
                {/* Breathing Online Dot */}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75 duration-1000" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-white dark:border-slate-900" />
                </span>
              </div>

              {/* Text on Desktop (Hidden on Mobile) */}
              <div className="hidden sm:flex flex-col text-left pr-1">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xs font-black tracking-wide text-white drop-shadow-xs whitespace-nowrap">
                    Ask KrishiMitra
                  </span>
                  <span className="bg-emerald-400/30 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md leading-none border border-white/20 flex items-center gap-0.5">
                    <Sparkles className="w-2 h-2 text-amber-300" />
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-emerald-100/90 font-medium leading-tight mt-0.5">
                  Free Agronomist Advice
                </span>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────────
          2. MOBILE BACKDROP (Tapping outside dismisses bottom sheet)
          ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {chatOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setChatOpen(false)}
            className="fixed inset-0 bg-slate-950/65 dark:bg-black/80 backdrop-blur-xs z-[115] sm:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────────
          3. CHAT PANEL (Mobile: Slide-up Sheet / Desktop: Floating Card)
          ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={isMobile ? { y: '100%' } : { opacity: 0, y: 24, scale: 0.94 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, y: 20, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (isMobile && info.offset.y > 100) {
                setChatOpen(false);
              }
            }}
            className="pointer-events-auto fixed z-[120] sm:z-[95] 
              inset-x-0 bottom-0 h-[85dvh] max-h-[90dvh] rounded-t-[28px] border-t border-x border-emerald-500/30
              sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[410px] sm:h-[600px] sm:max-h-[calc(100vh-3.5rem)] sm:rounded-2xl sm:border sm:border-emerald-500/25 dark:sm:border-emerald-700/40
              bg-white dark:bg-slate-900 shadow-[0_-15px_50px_rgba(0,0,0,0.35)] sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] 
              flex flex-col justify-between overflow-hidden"
          >
            {/* Header with Title, PRO Badge, Drag Handle (mobile), and Action Buttons */}
            <ChatHeader onClose={() => setChatOpen(false)} onClear={handleClearChat} />

            {/* Messages Scroll Area with Agricultural Subtle Pattern */}
            <div 
              className="flex-1 overflow-y-auto p-3 sm:p-4 bg-emerald-50/40 dark:bg-slate-950/80 relative overscroll-contain"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.04' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 p-2.5 bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-emerald-200/60 dark:border-slate-800 w-fit backdrop-blur-xs shadow-xs font-semibold">
                  <AnimatedSparkles size={16} className="text-emerald-500 animate-spin" />
                  <span>KrishiMitra AI is generating farming advice...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggested Queries */}
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pt-2 border-t border-emerald-100/60 dark:border-slate-800 shrink-0">
              <QuickReplies disabled={isTyping} onSelect={(query) => handleSendMessage(query)} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="p-2.5 sm:p-3 pb-3 sm:pb-3 bg-white dark:bg-slate-900 border-t border-emerald-100/80 dark:border-slate-800 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                disabled={isTyping}
                placeholder={isTyping ? "KrishiMitra AI is replying..." : "Ask about crops, fertilizers, dosage, pests..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              />
              <motion.button
                whileHover={!isTyping && inputMessage.trim() ? { scale: 1.05 } : {}}
                whileTap={!isTyping && inputMessage.trim() ? { scale: 0.95 } : {}}
                type="submit"
                disabled={isTyping || !inputMessage.trim()}
                className="p-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-xl hover:from-emerald-500 hover:to-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm shrink-0"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
};
