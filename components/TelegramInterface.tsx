
import React, { useState, useEffect, useRef } from 'react';
import { Role, Message, AppState } from '../types';
import { gemini } from '../services/geminiService';
import { getTopicForDate } from '../utils/roadmap';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const TelegramInterface: React.FC<Props> = ({ state, setState }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages, isTyping]);

  const addMessage = (role: Role, text: string) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      text,
      timestamp: Date.now(),
    };
    
    setState(prev => ({
      ...prev,
      messages: [...(prev.messages || []), newMessage].slice(-50)
    }));
  };

  const handleCommand = async (cmd: string) => {
    setErrorMessage(null);
    const today = new Date().toISOString().split('T')[0];
    
    if (cmd === '/start') {
      addMessage(Role.MENTOR, "Sen bilan o'yin o'ynashga vaqtim yo'q. Maqsading 1500 reyting bo'lsa, xatolaringni tahlil qilishga tayyor tur. Bu yerda hamma narsa jiddiy.\n\n/today - Bugungi vazifalar (agar tayyor bo'lsang)");
      return;
    }

    setIsTyping(true);

    if (cmd === '/today') {
      try {
        let currentSet = state.dailySets?.[today];
        if (!currentSet) {
          const topic = getTopicForDate(state.profile.startDate, today);
          const problems = await gemini.generateDailyProblems(topic, state.profile.currentRating);
          
          currentSet = {
            date: today,
            topic,
            problems,
            isRestDay: false,
            completed: false,
            solvedIds: []
          };
          setState(prev => ({
            ...prev,
            dailySets: { ...(prev.dailySets || {}), [today]: currentSet! }
          }));
        }

        const probList = currentSet.problems.map((p, i) => {
          const isSolved = currentSet!.solvedIds.includes(p.id);
          return `${i+1}. ${isSolved ? '✅' : '⭕'} ${p.title} (${p.rating}) - https://codeforces.com/problemset/problem/${p.id}`;
        }).join('\n');
        
        addMessage(Role.MENTOR, `📚 Mavzu: **${currentSet.topic}**\n\nBu masalalar senga osonlik qilmaydi. Diqqat bilan tahlil qil:\n\n${probList}\n\nYechim mantiqini yoz, xatolaringni kutaman.`);
      } catch (error: any) {
        setErrorMessage("⚠️ API xatosi. Keyinroq urin.");
      } finally {
        setIsTyping(false);
      }
      return;
    }

    try {
      const history = (state.messages || []).map(m => ({
        role: m.role === Role.USER ? 'user' as const : 'model' as const,
        parts: [{ text: m.text }]
      }));
      
      const response = await gemini.getMentorResponse(history, cmd);
      addMessage(Role.MENTOR, response);
    } catch (error: any) {
      const isQuota = error.message?.includes('429') || error.message?.toLowerCase().includes('quota');
      if (isQuota) {
        setErrorMessage("⌛ API limiti tugadi. Kutishni o'rgan.");
      } else {
        setErrorMessage("❌ Xatolik yuz berdi.");
      }
    } finally {
      setIsTyping(false);
    }
  };

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    const text = inputValue.trim();
    addMessage(Role.USER, text);
    setInputValue('');
    handleCommand(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto bg-[#17212B] shadow-2xl rounded-xl overflow-hidden border border-gray-800">
      <div className="bg-[#242F3D] text-white p-3 flex items-center justify-between border-b border-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-white shadow-lg border border-red-500">M</div>
          <div>
            <h2 className="font-semibold text-sm">AI CP Mentor</h2>
            <p className="text-[10px] text-red-400 font-medium">● Sizni kuzatmoqda</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0E1621] scroll-smooth">
        {(state.messages || []).map((m) => (
          <div key={m.id} className={`flex ${m.role === Role.USER ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-md animate-in fade-in zoom-in duration-300 ${
              m.role === Role.USER ? 'bg-[#2B5278] text-white rounded-tr-none' : 'bg-[#182533] text-gray-100 rounded-tl-none border border-gray-700/50'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
              <div className="text-[9px] mt-1 text-gray-500 text-right opacity-70">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#182533] text-red-400 rounded-2xl p-2 px-4 text-xs flex items-center gap-2 border border-red-900/20">
              <span className="flex gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span>
                <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse [animation-delay:0.4s]"></span>
              </span>
              Mentor yozmoqda...
            </div>
          </div>
        )}
        {errorMessage && (
          <div className="flex justify-center py-2">
            <div className="bg-red-900/20 text-red-300 text-[11px] px-4 py-1.5 rounded-full border border-red-900/30">
              {errorMessage}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={onSend} className="p-3 bg-[#17212B] border-t border-gray-800 flex gap-2">
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isTyping ? "Kuting..." : "Xatoingni tan olishga tayyormisan?..."}
          disabled={isTyping}
          className="flex-1 bg-[#242F3D] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-red-500 text-sm border border-gray-700 disabled:opacity-50 transition-all placeholder:text-gray-600"
        />
        <button type="submit" disabled={isTyping || !inputValue.trim()} className="bg-red-700 hover:bg-red-600 text-white p-2.5 rounded-xl transition-all active:scale-95 disabled:grayscale disabled:opacity-40">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default TelegramInterface;
