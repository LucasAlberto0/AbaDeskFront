import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  User,
  Info,
  HelpCircle,
  Workflow,
  Building2,
  Bug
} from 'lucide-react';
import useAuthStore from '../../auth/hooks/useAuthStore';
import toast from 'react-hot-toast';
import { sendChatMessage } from '../api/assistantService';

export default function AssistantPage() {
  const { user } = useAuthStore();
  const storageKey = user?.id ? `abadesk_ai_messages_${user.id}` : 'abadesk_ai_messages';
  const sessionKey = user?.id ? `abadesk_ai_session_${user.id}` : 'abadesk_ai_session';

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    try {
      return localStorage.getItem(sessionKey) || null;
    } catch {
      return null;
    }
  });
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatInputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setMessages(saved ? JSON.parse(saved) : []);
      const savedSession = localStorage.getItem(sessionKey);
      setSessionId(savedSession || null);
    } catch {
      setMessages([]);
      setSessionId(null);
    }
  }, [storageKey, sessionKey]);

  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {
    }
  }, [messages, storageKey]);

  useEffect(() => {
    try {
      if (sessionId) {
        localStorage.setItem(sessionKey, sessionId);
      } else {
        localStorage.removeItem(sessionKey);
      }
    } catch {
    }
  }, [sessionId, sessionKey]);

  const promptSuggestions = [
    {
      icon: HelpCircle,
      title: 'Abrir chamado',
      prompt: 'Como faço para abrir um novo chamado de suporte no sistema?'
    },
    {
      icon: Workflow,
      title: 'Etapas do fluxo',
      prompt: 'Quais são as etapas do fluxo de atendimento de um chamado?'
    },
    {
      icon: Building2,
      title: 'Alterar empresa',
      prompt: 'Como posso alterar a unidade da minha empresa no meu perfil?'
    },
    {
      icon: Bug,
      title: 'Relatar incidentes',
      prompt: 'Quais informações são importantes incluir ao relatar um erro técnico?'
    }
  ];

  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior
      });
    }
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom('smooth');
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      if (messages.length > 0) {
        chatInputRef.current?.focus();
      } else {
        inputRef.current?.focus();
      }
    }
  }, [messages.length]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [messages.length > 0]);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) return parts[0][0] + parts[1][0];
    return parts[0][0];
  };


  const handleSend = async (textToSend) => {
    const text = typeof textToSend === 'string' ? textToSend.trim() : inputMessage.trim();
    if (!text || isTyping) return;

    if (window.innerWidth < 768 && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    window.scrollTo(0, 0);

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const data = await sendChatMessage({ message: text, sessionId });
      if (data?.sessionId) {
        setSessionId(data.sessionId);
      }

      const aiResponse = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: data?.response || 'Não foi possível obter uma resposta textual da assistente.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Falha ao comunicar com a ABA IA. Tente novamente em instantes.';
      toast.error(errorMessage);
      const fallbackResponse = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: `⚠️ **Aviso:** ${errorMessage}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Resposta copiada para a área de transferência!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (messages.length === 0) return;
    setMessages([]);
    setInputMessage('');
    setSessionId(null);
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(sessionKey);
    } catch {
    }
    toast.success('Conversa reiniciada com sucesso!');
  };

  const renderFormattedText = (content) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-2 text-[13px] sm:text-[14px] leading-relaxed text-slate-700">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }

          const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return (
                <em key={pIdx} className="italic text-slate-600">
                  {part.slice(1, -1)}
                </em>
              );
            }
            return part;
          });

          if (line.startsWith('• ')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-[#c8101e] font-bold text-sm leading-none mt-1">•</span>
                <span>{formattedLine}</span>
              </div>
            );
          }

          if (/^\d+\.\s/.test(line)) {
            const match = line.match(/^(\d+)\.\s(.*)/);
            if (match) {
              const num = match[1];
              const rest = match[2].split(/(\*\*.*?\*\*)/g).map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={pIdx} className="font-semibold text-slate-900">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return part;
              });

              return (
                <div key={idx} className="flex items-start gap-2.5 pl-1">
                  <span className="w-5 h-5 rounded-full bg-red-100 border border-red-200 text-[#9d0012] font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {num}
                  </span>
                  <span>{rest}</span>
                </div>
              );
            }
          }

          return <p key={idx}>{formattedLine}</p>;
        })}
      </div>
    );
  };

  const isChatActive = messages.length > 0;

  return (
    <div className="relative flex flex-col h-full w-full bg-white overflow-hidden select-none">

      <AnimatePresence>
        {isChatActive && (
          <motion.header
            key="chat-header"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="px-3 sm:px-8 py-2.5 sm:py-3 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between gap-2 sm:gap-3 shrink-0 z-20"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#c8101e] p-1.5 flex items-center justify-center shadow-sm shrink-0">
                <img
                  src="/img/brand/logo-da-ia-aba.png"
                  alt="AbaDesk IA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                  ABA Assist
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate hidden xs:block">
                  Central inteligente de suporte e atendimento
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleClearChat}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
                title="Reiniciar conversa"
              >
                <RotateCcw size={14} />
                <span className="hidden xs:inline">Nova conversa</span>
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto w-full flex flex-col min-h-0"
      >
        <AnimatePresence mode="wait">
          {!isChatActive ? (
            <motion.div
              key="hero-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex-1 my-auto flex flex-col items-center justify-center text-center px-4 py-3 sm:py-8 max-w-3xl mx-auto w-full min-h-0"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="relative mb-3 sm:mb-5"
              >
                <div className="relative w-14 h-14 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-[#c8101e] p-2 sm:p-3 flex items-center justify-center shadow-xl shadow-red-900/15">
                  <img
                    src="/img/brand/logo-da-ia-aba.png"
                    alt="AbaDesk IA"
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>

              <div className="mb-4 sm:mb-8">
                <h1 className="text-xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
                  Qual desafio vamos <br className="hidden xs:inline" />
                  <span className="text-[#9d0012]">solucionar juntos hoje?</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 sm:mt-2.5 max-w-sm sm:max-w-lg mx-auto leading-relaxed px-2">
                  Descreva qualquer problema ou incidente para receber diagnósticos ágeis, orientações técnicas e soluções precisas.
                </p>
              </div>

              <div className="w-full max-w-2xl px-1">
                <div className="relative flex items-center rounded-full bg-slate-50/90 hover:bg-slate-100/90 border border-slate-300 focus-within:border-[#c8101e] focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 shadow-lg shadow-slate-200/50 transition-all px-3.5 sm:px-5 py-1.5 sm:py-2.5">

                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Peça à ABA Assist..."
                    disabled={isTyping}
                    className="flex-1 bg-transparent pr-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none min-w-0"
                  />

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSend()}
                      disabled={!inputMessage.trim() || isTyping}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${inputMessage.trim() && !isTyping
                        ? 'bg-[#c8101e] hover:bg-[#b00d19] text-white shadow-md shadow-red-900/20 cursor-pointer scale-100'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed scale-95'
                        }`}
                      title="Enviar mensagem"
                    >
                      <ArrowUp size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 max-w-xl mx-auto">
                  {promptSuggestions.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSend(item.prompt)}
                        className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-50 hover:bg-red-50/50 border border-slate-200 hover:border-red-300 text-slate-700 hover:text-[#9d0012] text-[11px] sm:text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                      >
                        <IconComponent size={12} className="text-[#c8101e]" />
                        <span>{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat-messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1 space-y-4 max-w-3xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6"
            >
              <AnimatePresence initial={false}>
                {messages.map((message) => {
                  const isUser = message.sender === 'user';

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 14, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25 }}
                      className={`group flex items-start gap-2.5 sm:gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold shadow-xs overflow-hidden ${isUser
                        ? 'bg-[#c8101e] text-white ring-2 ring-red-100'
                        : 'bg-[#c8101e] p-1'
                        }`}>
                        {isUser ? getInitials(user?.name) : (
                          <img
                            src="/img/brand/logo-da-ia-aba.png"
                            alt="AbaDesk IA"
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>

                      <div className={`flex flex-col min-w-0 max-w-[88%] sm:max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-xs break-words ${isUser
                          ? 'bg-[#9d0012] text-white rounded-tr-xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs'
                          }`}>
                          {isUser ? (
                            <p className="text-[13px] sm:text-[14px] leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>
                          ) : (
                            renderFormattedText(message.text)
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1 px-1">
                          <span className="text-[10px] text-slate-400">{message.timestamp}</span>
                          {!isUser && (
                            <button
                              onClick={() => handleCopy(message.id, message.text)}
                              className={`text-slate-400 hover:text-slate-600 transition-opacity duration-200 p-0.5 rounded flex items-center gap-1 text-[11px] cursor-pointer ${
                                copiedId === message.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
                              }`}
                              title="Copiar resposta"
                            >
                              {copiedId === message.id ? (
                                <>
                                  <Check size={12} className="text-emerald-600" />
                                  <span className="text-emerald-600 font-medium">Copiado</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>Copiar</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 sm:gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-[#c8101e] p-1 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                    <img
                      src="/img/brand/logo-da-ia-aba.png"
                      alt="AbaDesk IA"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#c8101e] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#c8101e] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#c8101e] animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-xs text-slate-500 ml-1.5 font-medium">Aba Assist pensando...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isChatActive && (
          <motion.div
            key="bottom-input-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="p-2 sm:p-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] bg-white border-t border-slate-200 shrink-0 z-10 shadow-lg"
          >
            <div className="max-w-3xl mx-auto w-full">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                <span className="text-[11px] text-slate-500 shrink-0 flex items-center gap-1 mr-1">
                  <Sparkles size={12} className="text-[#c8101e]" /> Sugestões:
                </span>
                {promptSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(item.prompt)}
                    className="shrink-0 px-2.5 py-1 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-[#9d0012] border border-slate-200 hover:border-red-200 rounded-full text-[11px] transition-colors cursor-pointer"
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              <div className="relative flex items-center rounded-full bg-slate-50 hover:bg-slate-100/90 border border-slate-300 focus-within:border-[#c8101e] focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 shadow-sm transition-all px-3.5 sm:px-5 py-1.5 sm:py-2.5">

                <input
                  ref={chatInputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Peça à ABA Assist..."
                  disabled={isTyping}
                  className="flex-1 bg-transparent pr-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none min-w-0"
                />

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!inputMessage.trim() || isTyping}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${inputMessage.trim() && !isTyping
                      ? 'bg-[#c8101e] hover:bg-[#b00d19] text-white shadow-md shadow-red-900/20 cursor-pointer scale-100'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed scale-95'
                      }`}
                    title="Enviar mensagem"
                  >
                    <ArrowUp size={16} />
                  </button>
                </div>
              </div>

              <p className="text-[10px] sm:text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                <Info size={12} className="shrink-0" />
                O ABA Assist pode cometer erros. Verifique informações operacionais importantes com a equipe técnica.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
