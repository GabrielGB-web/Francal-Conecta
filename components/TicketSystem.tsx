
import React, { useState } from 'react';
import { Ticket, Department, Priority, TicketMessage, TicketStatus, UserProfile } from '../types.ts';
import { Plus, X, Sparkles, Send, MessageSquare, CheckCircle2, UserPlus, ShieldCheck } from 'lucide-react';
import { improveTicketDescription, categorizePriority } from '../services/geminiService.ts';

interface TicketSystemProps {
  tickets: Ticket[];
  users: UserProfile[];
  departments: any[];
  addTicket: (ticket: Ticket) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  addMessageToTicket: (id: string, message: TicketMessage) => void;
  assignTicket: (id: string, userId: string, userName: string) => void;
  user: UserProfile;
}

const TicketSystem: React.FC<TicketSystemProps> = ({ tickets, users, departments, addTicket, updateTicketStatus, addMessageToTicket, assignTicket, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [msgInput, setMsgInput] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Ativos' | 'Encerrados'>('Ativos');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    toDepartment: 'TI',
    priority: 'Média' as Priority,
    assignedToId: '',
  });

  const isSuperUser = user.dept === 'TI' || user.dept === 'Diretoria';
  const isManager = isSuperUser || user.role === 'Gerente' || user.role === 'Supervisor';

  const availableUsersForDept = users.filter(u => u.dept === formData.toDepartment);

  const filteredTickets = tickets.filter(t => {
    if (isSuperUser) return true;
    if (isManager && (t.toDepartment === user.dept || t.fromDepartment === user.dept)) return true;
    return t.createdById === user.id || t.assignedToId === user.id;
  });

  const activeTickets = filteredTickets.filter(t => t.status !== 'Concluído' && t.status !== 'Cancelado');
  const closedTickets = filteredTickets.filter(t => t.status === 'Concluído' || t.status === 'Cancelado');
  const displayedTickets = filterStatus === 'Ativos' ? activeTickets : closedTickets;

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  const handleImproveText = async () => {
    if (!formData.description) return;
    setLoadingAI(true);
    const improved = await improveTicketDescription(formData.description, formData.toDepartment);
    const suggestion = await categorizePriority(formData.title, improved);
    setFormData(prev => ({
      ...prev,
      description: improved,
      priority: (suggestion.priority as Priority) || prev.priority
    }));
    setLoadingAI(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedUser = users.find(u => u.id === formData.assignedToId);

    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      title: formData.title,
      description: formData.description,
      fromDepartment: user.dept,
      toDepartment: formData.toDepartment,
      createdBy: user.name,
      createdById: user.id,
      assignedTo: assignedUser?.name,
      assignedToId: assignedUser?.id,
      createdAt: new Date(),
      status: 'Aberto',
      priority: formData.priority,
      messages: []
    };
    addTicket(newTicket);
    setIsModalOpen(false);
    setFormData({ title: '', description: '', toDepartment: departments[0].id, priority: 'Média', assignedToId: '' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim() || !selectedTicketId) return;
    addMessageToTicket(selectedTicketId, {
      id: Date.now().toString(),
      author: user.name,
      text: msgInput,
      timestamp: new Date()
    });
    setMsgInput('');
  };

  const handleAssignInChat = () => {
    if (!selectedTicketId) return;
    const name = prompt("Digite o nome do colaborador de " + selectedTicket?.toDepartment + " para designar:\n\nOpções: " + availableUsersForDept.map(u => u.name).join(", "));
    const foundUser = users.find(u => u.name.toLowerCase() === name?.toLowerCase() && u.dept === selectedTicket?.toDepartment);
    if (foundUser) {
      assignTicket(selectedTicketId, foundUser.id, foundUser.name);
    } else if (name) {
      alert("Colaborador não encontrado neste departamento.");
    }
  };

  const priorityColors = {
    'Baixa': 'bg-gray-100 text-gray-600',
    'Média': 'bg-blue-100 text-blue-600',
    'Alta': 'bg-orange-100 text-orange-600',
    'Urgente': 'bg-red-100 text-red-600',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[700px] animate-in fade-in duration-500 pb-20">
      <div className={`flex-1 space-y-6 ${selectedTicketId ? 'hidden lg:block' : 'block'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight uppercase">Suporte Interno</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Abertura e gestão de chamados.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-royal-blue text-white px-8 py-4 rounded-[1.5rem] flex items-center gap-3 hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/10 font-black uppercase text-xs tracking-widest"
          >
            <Plus size={18} /> Novo Chamado
          </button>
        </div>

        <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-sm w-fit">
          <button
            onClick={() => setFilterStatus('Ativos')}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === 'Ativos' ? 'bg-royal-blue text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Ativos ({activeTickets.length})
          </button>
          <button
            onClick={() => setFilterStatus('Encerrados')}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === 'Encerrados' ? 'bg-royal-blue text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Encerrados ({closedTickets.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2 no-scrollbar max-h-[calc(100vh-320px)]">
          {displayedTickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicketId(ticket.id)}
              className={`bg-white p-8 rounded-[3rem] border transition-all cursor-pointer relative overflow-hidden ${selectedTicketId === ticket.id ? 'border-royal-blue ring-4 ring-royal-blue/5' : 'border-gray-100 hover:shadow-xl hover:shadow-blue-900/5'
                }`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${priorityColors[ticket.priority as keyof typeof priorityColors]}`}>
                  {ticket.priority}
                </span>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">REF: {ticket.id}</p>
              </div>
              <h3 className="text-lg font-black text-gray-800 mb-3 truncate">{ticket.title}</h3>
              <p className="text-gray-400 text-xs line-clamp-2 mb-8 leading-relaxed">{ticket.description}</p>
              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">{ticket.fromDepartment} → {ticket.toDepartment}</p>
                </div>
                {ticket.assignedTo && <span className="text-[8px] font-black text-royal-blue uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-full border border-blue-100">{ticket.assignedTo.split(' ')[0]}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`lg:w-96 xl:w-[450px] bg-white rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all ${!selectedTicketId ? 'hidden lg:flex opacity-30 grayscale pointer-events-none' : 'flex animate-in slide-in-from-right-4'}`}>
        {!selectedTicket ? (
          <div className="flex-1 flex items-center justify-center p-12 text-center text-gray-300">
            <MessageSquare size={48} className="opacity-10" />
          </div>
        ) : (
          <>
            <div className="p-8 bg-royal-blue text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedTicketId(null)} className="lg:hidden p-2"><X size={20} /></button>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-widest truncate max-w-[200px]">{selectedTicket.title}</h4>
                  <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">{selectedTicket.status}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {isManager && selectedTicket.status !== 'Concluído' && (
                  <button onClick={handleAssignInChat} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/20">
                    <UserPlus size={16} />
                  </button>
                )}
                {selectedTicket.status !== 'Concluído' && (
                  <button onClick={() => updateTicketStatus(selectedTicket.id, 'Concluído')} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 border border-white/20">
                    <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto bg-gray-50/30 space-y-8 no-scrollbar">
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Relato Original</p>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{selectedTicket.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[8px] font-black text-gray-400 uppercase">De: {selectedTicket.createdBy}</span>
                  {selectedTicket.assignedTo && <span className="text-[8px] font-black text-royal-blue uppercase">Com: {selectedTicket.assignedTo}</span>}
                </div>
              </div>

              <div className="space-y-4">
                {selectedTicket.messages.map(m => (
                  <div key={m.id} className={`flex flex-col ${m.author === user.name ? 'items-end' : 'items-start'}`}>
                    <div className={`p-4 rounded-[1.5rem] text-xs font-medium shadow-sm max-w-[85%] ${m.author === user.name ? 'bg-royal-blue text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}>
                      {m.text}
                    </div>
                    <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest mt-1.5 px-2">{m.author}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedTicket.status !== 'Concluído' && (
              <form onSubmit={handleSendMessage} className="p-8 bg-white border-t border-gray-100">
                <div className="relative">
                  <input
                    type="text" placeholder="Escrever mensagem..." value={msgInput} onChange={e => setMsgInput(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-6 pr-14 text-xs font-bold outline-none focus:ring-2 focus:ring-royal-blue/10"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-royal-blue text-white rounded-xl flex items-center justify-center shadow-lg"><Send size={16} /></button>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-royal-blue text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3"><ShieldCheck size={24} /> Nova Demanda</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={28} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Para o Departamento</label>
                  <select
                    value={formData.toDepartment}
                    onChange={e => {
                      const newDept = e.target.value as Department;
                      setFormData({ ...formData, toDepartment: newDept, assignedToId: '' });
                    }}
                    className="w-full bg-gray-50 border-none rounded-xl px-5 py-3 text-xs font-black outline-none"
                  >
                    {departments.filter(d => d.id !== 'Comercial').map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Direcionar a (Opcional)</label>
                  <select
                    value={formData.assignedToId}
                    onChange={e => setFormData({ ...formData, assignedToId: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-xl px-5 py-3 text-xs font-black outline-none"
                  >
                    <option value="">Aberto (Qualquer um)</option>
                    {users.filter(u => u.dept === formData.toDepartment).map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Assunto</label>
                  <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl px-5 py-3 text-xs font-bold" placeholder="Resumo curto" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Prioridade</label>
                  <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })} className="w-full bg-gray-50 border-none rounded-xl px-5 py-3 text-xs font-black outline-none">
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 relative">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase">Detalhamento</label>
                  <button type="button" onClick={handleImproveText} disabled={loadingAI || !formData.description} className="text-[8px] font-black text-royal-blue uppercase flex items-center gap-1 hover:underline disabled:opacity-20"><Sparkles size={12} /> Refinar com IA</button>
                </div>
                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-xs font-medium resize-none" placeholder="Explique detalhadamente..."></textarea>
              </div>
              <button type="submit" className="w-full bg-royal-blue text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-blue-900 transition-all flex items-center justify-center gap-3"><Send size={16} /> Enviar Chamado</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketSystem;
