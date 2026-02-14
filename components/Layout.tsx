
import React, { useState } from 'react';
import { Menu, X, Bell, LogOut, Search } from 'lucide-react';
import { NAV_ITEMS, SYSTEM_NAME } from '../constants.tsx';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: { name: string; dept: string; role: string };
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Regras de Navegação
  const filteredNavItems = NAV_ITEMS.filter(item => {
    // Comercial não vê Suporte
    if (item.id === 'tickets' && user.dept === 'Comercial') return false;

    // Apenas TI e Diretoria vêem o Arquivo Geral
    if (item.id === 'archive' && !(user.dept === 'TI' || user.dept === 'Diretoria')) return false;

    return true;
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <aside
        className={`${isSidebarOpen ? 'w-72' : 'w-24'
          } transition-all duration-300 ease-in-out bg-royal-blue text-white flex flex-col shadow-2xl z-20`}
      >
        <div className="p-8 flex items-center justify-between border-b border-white/10">
          <div className={`flex items-center gap-4 overflow-hidden ${!isSidebarOpen && 'hidden'}`}>
            <div className="w-11 h-11 bg-red-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl border border-red-400/30">F</div>
            <span className="font-black text-lg tracking-widest uppercase">{SYSTEM_NAME.split(' ')[0]}</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hover:bg-white/10 p-2.5 rounded-xl transition-all shadow-inner"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-5 mt-10 overflow-y-auto no-scrollbar">
          <ul className="space-y-3">
            {filteredNavItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-5 p-4 rounded-[1.5rem] transition-all relative group ${activeTab === item.id
                      ? 'bg-white text-royal-blue shadow-2xl font-black scale-105'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <span className={`${activeTab === item.id ? 'text-royal-blue' : 'text-blue-200/40'} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </span>
                  {isSidebarOpen && <span className="text-[11px] uppercase tracking-widest font-black">{item.label}</span>}
                  {activeTab === item.id && !isSidebarOpen && (
                    <div className="absolute left-0 w-1.5 h-8 bg-red-600 rounded-r-full"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 mt-auto">
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-5 p-4 rounded-[1.5rem] text-white/50 hover:bg-red-600 hover:text-white transition-all group overflow-hidden ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-[11px] font-black uppercase tracking-widest">Sair do Sistema</span>}
          </button>
        </div>

        <div className="p-8 border-t border-white/5 bg-black/10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gray-400 border-2 border-white/20 shadow-xl flex items-center justify-center text-sm font-black shrink-0 text-white">
              {user.name.charAt(0)}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-xs font-black truncate text-white uppercase tracking-wider">{user.name.split(' ')[0]}</p>
                <p className="text-[9px] text-blue-200/50 uppercase font-black tracking-widest truncate">{user.dept}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 bg-white border-b-2 border-gray-100 flex items-center justify-between px-10 shadow-sm z-10">
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-4">
              <span className="text-royal-blue font-black text-[10px] bg-blue-50 border-2 border-blue-100 px-5 py-2 rounded-2xl uppercase tracking-widest shadow-sm">{user.dept}</span>
              <span className="text-gray-200">/</span>
              <span className="text-royal-blue/30 text-[10px] font-black uppercase tracking-[0.2em]">
                {NAV_ITEMS.find(i => i.id === activeTab)?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button className="relative p-3 text-royal-blue/40 hover:bg-blue-50 hover:text-royal-blue rounded-2xl transition-all group">
              <Bell size={24} />
              <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-red-600 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
            </button>
            <div className="h-10 w-[2px] bg-gray-100 rounded-full"></div>
            <div className="text-right">
              <p className="text-sm font-black text-royal-blue tracking-tight uppercase">Central Francal</p>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">V 2.5 • Conecta</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-gray-50/50 no-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
