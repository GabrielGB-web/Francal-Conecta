
import React, { useState } from 'react';
import { Department, Promotion, Announcement } from '../types.ts';
import { Megaphone, Plus, ShieldAlert, X, Send, Tag, Info } from 'lucide-react';

interface DepartmentPortalProps {
  user: { id: string; name: string; dept: Department };
  activeDept: Department;
  setActiveDept: (dept: Department) => void;
  departments: any[];
  promotions: Promotion[];
  announcements: Announcement[];
  onAddPromotion: (promo: Promotion) => void;
  onUpdatePromotion: (promo: Promotion) => void;
  onAddAnnouncement: (ann: Announcement) => void;
  onUpdateAnnouncement: (ann: Announcement) => void;
}

const DepartmentPortal: React.FC<DepartmentPortalProps> = ({
  user,
  activeDept,
  setActiveDept,
  departments,
  promotions,
  announcements,
  onAddAnnouncement,
  onAddPromotion
}) => {
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);
  const [announceForm, setAnnounceForm] = useState({ title: '', content: '' });

  const isSuperUser = user.dept === 'TI' || user.dept === 'Diretoria';
  const visibleDepartments = isSuperUser ? departments : departments.filter(d => d.id === user.dept);

  const deptAnnouncements = announcements.filter(a => a.department === activeDept);

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnn: Announcement = {
      id: Date.now().toString(),
      department: activeDept,
      title: announceForm.title,
      content: announceForm.content,
      author: user.name,
      date: new Date()
    };
    onAddAnnouncement(newAnn);
    setIsAnnounceModalOpen(false);
    setAnnounceForm({ title: '', content: '' });
  };

  if (!isSuperUser && activeDept !== user.dept) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in-95">
        <div className="p-12 bg-white rounded-[4rem] border-4 border-dashed border-red-100 shadow-2xl">
          <ShieldAlert size={80} className="text-red-500 mb-8 mx-auto opacity-20" />
          <h2 className="text-3xl font-black text-royal-blue uppercase tracking-tight mb-4">Acesso Restrito</h2>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto leading-relaxed">Você não possui credenciais para visualizar este portal departamental.</p>
          <button
            onClick={() => setActiveDept(user.dept)}
            className="mt-10 bg-royal-blue text-white px-10 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl hover:bg-blue-900 transition-all active:scale-95"
          >
            Retornar para {user.dept}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-4xl font-black text-royal-blue tracking-tighter uppercase">Portal {activeDept}</h2>
          <p className="text-sm text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Canais de Comunicação Francal</p>
        </div>
        <div className="bg-white p-3 rounded-[2.5rem] border-2 border-gray-100 shadow-xl flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
          {visibleDepartments.map(dept => (
            <button
              key={dept.id} onClick={() => setActiveDept(dept.id)}
              className={`flex items-center gap-4 px-8 py-4 rounded-[1.5rem] transition-all shrink-0 border-2 ${activeDept === dept.id ? 'bg-royal-blue border-royal-blue text-white shadow-2xl scale-105' : 'bg-gray-50 border-transparent text-royal-blue/30 font-black hover:bg-royal-blue/5 hover:text-royal-blue'}`}
            >
              <span className="font-black text-[11px] uppercase tracking-widest">{dept.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-12 rounded-[4rem] shadow-xl border-2 border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
              <Megaphone size={200} className="text-royal-blue" />
            </div>
            <div className="flex items-center justify-between mb-12 relative z-10">
              <h3 className="text-2xl font-black flex items-center gap-4 text-royal-blue uppercase tracking-tight">
                <Megaphone className="text-royal-blue" size={32} />
                Mural de Avisos
              </h3>
              {(isSuperUser || user.dept === activeDept) && (
                <button
                  onClick={() => setIsAnnounceModalOpen(true)}
                  className="bg-royal-blue text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-900 transition-all flex items-center gap-3"
                >
                  <Plus size={18} /> Publicar Aviso
                </button>
              )}
            </div>

            <div className="space-y-8 relative z-10">
              {deptAnnouncements.length === 0 ? (
                <div className="py-24 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                  <Info size={60} className="mx-auto mb-6 text-gray-200" />
                  <p className="text-gray-300 font-black uppercase text-[11px] tracking-widest">Aguardando novos comunicados da área.</p>
                </div>
              ) : (
                deptAnnouncements.map(ann => (
                  <div key={ann.id} className="p-8 bg-blue-50/50 rounded-[3rem] border-2 border-blue-100 hover:border-royal-blue/20 transition-all group shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-xl font-black text-royal-blue group-hover:translate-x-1 transition-transform">{ann.title}</h4>
                      <span className="text-[9px] font-black text-royal-blue/40 uppercase tracking-widest whitespace-nowrap">{new Date(ann.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed mb-8">{ann.content}</p>
                    <div className="pt-6 border-t border-blue-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-royal-blue flex items-center justify-center text-[10px] font-black text-white shadow-lg">{ann.author.charAt(0)}</div>
                      <p className="text-[10px] font-black text-royal-blue uppercase tracking-widest">Por: {ann.author}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-blue-50 p-12 rounded-[4rem] border-2 border-blue-100 shadow-xl shadow-blue-900/10">
            <h3 className="text-2xl font-black mb-10 text-royal-blue uppercase tracking-tight border-b-2 border-royal-blue/10 pb-6 flex items-center gap-4">
              <Tag size={28} /> Funções da Área
            </h3>
            <div className="space-y-4">
              {departments.find(d => d.id === activeDept)?.roles.map((r: string, i: number) => (
                <div key={i} className="flex items-center gap-5 p-6 bg-white rounded-[2rem] border-2 border-royal-blue/5 hover:border-royal-blue/20 shadow-sm transition-all group">
                  <div className="w-4 h-4 rounded-lg bg-royal-blue/10 flex items-center justify-center group-hover:bg-royal-blue group-hover:rotate-45 transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-royal-blue group-hover:bg-white"></div>
                  </div>
                  <span className="text-xs font-black text-royal-blue uppercase tracking-widest">{r}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-royal-blue p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-xl font-black mb-8 uppercase tracking-widest border-b border-white/10 pb-6">Campanhas Ativas</h3>
            <div className="space-y-6 text-center py-10">
              <ShieldAlert className="mx-auto opacity-20" size={48} />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Nenhuma campanha promocional em vigor.</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE AVISO */}
      {isAnnounceModalOpen && (
        <div className="fixed inset-0 bg-royal-blue/80 backdrop-blur-md z-[120] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 bg-royal-blue text-white flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase tracking-widest flex items-center gap-4"><Megaphone size={28} /> Novo Comunicado</h3>
              <button onClick={() => setIsAnnounceModalOpen(false)} className="hover:rotate-90 transition-transform"><X size={32} /></button>
            </div>
            <form onSubmit={handlePostAnnouncement} className="p-12 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-royal-blue uppercase ml-2 tracking-widest">Título do Aviso</label>
                <input
                  required
                  value={announceForm.title}
                  onChange={e => setAnnounceForm({ ...announceForm, title: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-8 py-5 text-xs font-bold text-royal-blue focus:border-royal-blue outline-none transition-all"
                  placeholder="Assunto importante..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-royal-blue uppercase ml-2 tracking-widest">Conteúdo Detalhado</label>
                <textarea
                  required
                  rows={5}
                  value={announceForm.content}
                  onChange={e => setAnnounceForm({ ...announceForm, content: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] px-8 py-6 text-xs font-medium text-gray-600 focus:border-royal-blue outline-none transition-all resize-none"
                  placeholder="Descreva as informações para a equipe..."
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-royal-blue text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-blue-900 transition-all active:scale-95 flex items-center justify-center gap-4">
                <Send size={20} /> Publicar no Mural Francal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentPortal;
