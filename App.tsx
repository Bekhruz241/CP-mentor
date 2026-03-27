
import React, { useState, useEffect } from 'react';
import TelegramInterface from './components/TelegramInterface';
import Dashboard from './components/Dashboard';
import { AppState } from './types';
import { loadState, saveState } from './utils/storage';

const App: React.FC = () => {
  // Sahifa yuklanganda xotiradan o'qiymiz
  const [state, setState] = useState<AppState>(() => loadState());
  const [activeTab, setActiveTab] = useState<'bot' | 'dashboard'>('bot');

  // Har safar state o'zgarganda localStorage-ga yozamiz
  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <div className="min-h-screen bg-[#0E1621] md:bg-gray-50 pb-20 md:pb-0">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 hidden md:block">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI CP Mentor
            </h1>
          </div>

          <nav className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('bot')}
              className={`text-sm font-medium transition-colors ${activeTab === 'bot' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Mentor Bot
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Statistika
            </button>
          </nav>

          <div className="flex items-center gap-2">
             <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
               {state.profile.currentRating} Rating
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto md:py-6 px-0 md:px-4">
        {activeTab === 'bot' ? (
          <div className="animate-in fade-in duration-500">
            <TelegramInterface state={state} setState={setState} />
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <Dashboard state={state} />
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#17212B] border-t border-gray-800 flex justify-around p-3 z-20">
        <button 
          onClick={() => setActiveTab('bot')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'bot' ? 'text-blue-400' : 'text-gray-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="text-[10px] font-medium">Chat</span>
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-blue-400' : 'text-gray-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 012 2h2a2 2 0 012-2" />
          </svg>
          <span className="text-[10px] font-medium">Progress</span>
        </button>
      </div>
    </div>
  );
};

export default App;
