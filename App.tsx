
import React, { useState, useEffect } from 'react';
import { Settings, UserPlus, ShieldPlus, Terminal, Archive, History, Briefcase, Plus, LayoutGrid } from 'lucide-react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TicketSystem from './components/TicketSystem';
import DepartmentPortal from './components/DepartmentPortal';
import Login from './components/Login';
import { Ticket, Department, TicketMessage, TicketStatus, UserProfile, Role, DeptDashboardStats, Announcement, Promotion } from './types';
import { DEPARTMENTS as INITIAL_DEPARTMENTS } from './constants';

const INITIAL_USERS: UserProfile[] = [
  { id: 'U-001', name: 'João Administrador', dept: 'TI', role: 'TI' },
  { id: 'U-002', name: 'Roberto Lima', dept: 'Comercial', role: 'Vendedor' },
  { id: 'U-003', name: 'Maria Diretora', dept: 'Diretoria', role: 'Donos' },
  { id: 'U-004', name: 'Cláudio Financeiro', dept: 'Financeiro', role: 'Gerente' }
];

const INITIAL_STATS: DeptDashboardStats[] = INITIAL_DEPARTMENTS.map(d => ({
  dept: d.id,
  metrics: d.id === 'Financeiro' ? [
    { label: 'Saldo em Caixa', value: 'R$ 842.150' },
    { label: 'Boletos Vencidos', value: '142' },
    { label: 'Inadimplência', value: '4.2%' },
  ] : d.id === 'Comercial' ? [
    { label: 'Vendas Mês', value: 'R$ 2.4M' },
    { label: 'Conversão', value: '12.5%' },
  ] : [
    { label: 'Atividade Geral', value: 'Estável' },
    { label: 'Eficiência SLA', value: '98%' },
  ]
}));

const App: React.FC = () => {
  // Estados Principais com Persistência
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('francal_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('francal_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('francal_tickets');
    return saved ? JSON.parse(saved) : [];
  });

  const [deptStats, setDeptStats] = useState<DeptDashboardStats[]>(() => {
    const saved = localStorage.getItem('francal_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('francal_announcements');
    return saved ? JSON.parse(saved) : [];
  });

  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem('francal_promotions');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [allDepartments, setAllDepartments] = useState<any[]>(INITIAL_DEPARTMENTS);
  const [activeDeptPortal, setActiveDeptPortal] = useState<Department>('TI');

  // Efeito para salvar dados sempre que mudarem
  useEffect(() => {
    localStorage.setItem('francal_users', JSON.stringify(users));
    localStorage.setItem('francal_tickets', JSON.stringify(tickets));
    localStorage.setItem('francal_stats', JSON.stringify(deptStats));
    localStorage.setItem('francal_announcements', JSON.stringify(announcements));
    localStorage.setItem('francal_promotions', JSON.stringify(promotions));
  }, [users, tickets, deptStats, announcements, promotions]);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('francal_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('francal_user');
  };

  // Forms de Gerenciamento
  const [newUserForm, setNewUserForm] = useState({ name: '', dept: 'TI', role: 'TI' });
  const [newDeptName, setNewDeptName] = useState('');
  const [roleForm, setRoleForm] = useState({ deptId: 'TI', roleName: '' });

  const isSuperUser = currentUser?.dept === 'TI' || currentUser?.dept === 'Diretoria';
  const canManage = isSuperUser || currentUser?.role === 'Gerente' || currentUser?.role === 'Supervisor';

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: UserProfile = {
      id: `U-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      name: newUserForm.name,
      dept: newUserForm.dept,
      role: newUserForm.role
    };
    setUsers([...users, user]);
    setNewUserForm({ ...newUserForm, name: '' });
    alert(`Usuário ${user.name} cadastrado com sucesso!`);
  };

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName) return;
    const newDept = {
      id: newDeptName,
      label: newDeptName,
      icon: <LayoutGrid size={18} />,
      color: 'bg-gray-500',
      roles: ['Colaborador']
    };
    setAllDepartments([...allDepartments, newDept]);
    setNewDeptName('');
    alert(`Departamento "${newDeptName}" criado com sucesso!`);
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.roleName) return;
    setAllDepartments(prev => prev.map(d => {
      if (d.id === roleForm.deptId) {
        return { ...d, roles: [...new Set([...d.roles, roleForm.roleName])] };
      }
      return d;
    }));
    setRoleForm({ ...roleForm, roleName: '' });
    alert(`Cargo adicionado ao departamento selecionado!`);
  };

  const updateStats = (newStats: DeptDashboardStats) => {
    setDeptStats(prev => {
      const existing = prev.find(s => s.dept === newStats.dept);
      if (existing) {
        return prev.map(s => s.dept === newStats.dept ? newStats : s);
      }
      return [...prev, newStats];
    });
  };

  const addTicket = (ticket: Ticket) => setTickets([ticket, ...tickets]);
  const updateTicketStatus = (id: string, status: TicketStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };
  const addMessageToTicket = (id: string, message: TicketMessage) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, messages: [...t.messages, message], status: 'Em Andamento' } : t));
  };
  const assignTicket = (id: string, userId: string, userName: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, assignedTo: userName, assignedToId: userId } : t));
  };

  useEffect(() => {
    if (currentUser) setActiveDeptPortal(currentUser.dept);
  }, [currentUser]);

  if (!currentUser) {
    return <Login onLogin={handleLogin} registeredUsers={users} />;
  }

  const closedTickets = tickets.filter(t => t.status === 'Concluído' || t.status === 'Cancelado');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={currentUser} onLogout={handleLogout}>
      {activeTab === 'dashboard' && <Dashboard tickets={tickets} user={currentUser} deptStats={deptStats} updateStats={updateStats} />}

      {activeTab === 'tickets' && currentUser.dept !== 'Comercial' && (
        <TicketSystem 
          tickets={tickets} 
          users={users}
          departments={allDepartments}
          addTicket={addTicket} 
          updateTicketStatus={updateTicketStatus}
          addMessageToTicket={addMessageToTicket}
          assignTicket={assignTicket}
          user={currentUser} 
        />
      )}

      {activeTab === 'archive' && isSuperUser && (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
           <div>
              <h2 className="text-3xl font-black text-royal-blue tracking-tight uppercase">Arquivo Geral</h2>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">Base Histórica Francal</p>
           </div>
           <div className="bg-white rounded-[3rem] border-2 border-gray-100 shadow-xl p-12">
              {closedTickets.length === 0 ? (
                <div className="py-24 text-center text-gray-300">
                   <History size={80} className="mx-auto mb-8 opacity-10" />
                   <p className="font-black uppercase text-xs tracking-widest">Aguardando arquivamento de demandas.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {closedTickets.map(t => (
                     <div key={t.id} className="p-10 bg-gray-50/50 rounded-[2.5rem] border-2 border-gray-100 hover:bg-white hover:border-royal-blue/20 transition-all group shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                           <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-5 py-2.5 rounded-xl uppercase tracking-widest shadow-sm">RESOLVIDO</span>
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.id}</span>
                        </div>
                        <h4 className="font-black text-royal-blue text-lg mb-4 group-hover:scale-105 transition-transform">{t.title}</h4>
                        <div className="pt-6 border-t border-gray-100">
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Autor: {t.createdBy}</p>
                           <p className="text-[9px] font-black text-royal-blue uppercase tracking-widest mt-1">Setor: {t.fromDepartment}</p>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>
      )}

      {activeTab === 'departments' && (
        <DepartmentPortal 
          user={currentUser}
          activeDept={activeDeptPortal}
          setActiveDept={setActiveDeptPortal}
          departments={allDepartments}
          promotions={promotions}
          announcements={announcements}
          onAddPromotion={(p) => setPromotions([p, ...promotions])}
          onUpdatePromotion={() => {}}
          onAddAnnouncement={(a) => setAnnouncements([a, ...announcements])}
          onUpdateAnnouncement={() => {}}
        />
      )}

      {activeTab === 'settings' && (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
          <div className="bg-white rounded-[3rem] p-12 border-2 border-gray-100 shadow-xl shadow-blue-900/5">
             <div className="flex justify-between items-center mb-16">
                <div>
                  <h2 className="text-3xl font-black text-royal-blue flex items-center gap-4 uppercase tracking-tight"><Settings size={36} /> Gestão Corporativa</h2>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Configurações de Acesso e Estrutura</p>
                </div>
                <div className="bg-blue-50 p-8 rounded-[2.5rem] border-2 border-blue-100 shadow-sm">
                   <p className="text-[10px] font-black text-royal-blue uppercase mb-5 px-1 tracking-widest">Painel de Troca Rápida</p>
                   <div className="flex gap-2 flex-wrap max-w-md">
                      {users.map(u => (
                        <button key={u.id} onClick={() => handleLogin(u)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentUser.id === u.id ? 'bg-royal-blue text-white shadow-lg' : 'bg-white text-royal-blue border-2 border-royal-blue/10 hover:bg-royal-blue/5'}`}>
                          {u.name.split(' ')[0]}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             {isSuperUser && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                   {/* Criar Departamento */}
                   <div className="p-12 bg-white rounded-[3.5rem] border-2 border-gray-100 relative group hover:border-royal-blue/30 transition-all shadow-sm">
                      <div className="absolute -top-5 left-10 bg-royal-blue text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Nova Divisão</div>
                      <h3 className="text-xl font-black text-royal-blue mb-10 flex items-center gap-4"><Plus size={24} /> Criar Setor</h3>
                      <form onSubmit={handleCreateDept} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Identificador</label>
                          <input required value={newDeptName} onChange={e=>setNewDeptName(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold text-royal-blue focus:border-royal-blue outline-none transition-all" placeholder="Marketing, Almoxarifado..." />
                        </div>
                        <button type="submit" className="w-full bg-royal-blue text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-blue-900 transition-all flex items-center justify-center gap-3">Ativar Departamento</button>
                      </form>
                   </div>

                   {/* Adicionar Cargos */}
                   <div className="p-12 bg-white rounded-[3.5rem] border-2 border-gray-100 relative group hover:border-royal-blue/30 transition-all shadow-sm">
                      <div className="absolute -top-5 left-10 bg-royal-blue text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Hierarquia</div>
                      <h3 className="text-xl font-black text-royal-blue mb-10 flex items-center gap-4"><Briefcase size={24} /> Criar Função</h3>
                      <form onSubmit={handleAddRole} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Departamento</label>
                             <select value={roleForm.deptId} onChange={e=>setRoleForm({...roleForm, deptId: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-xs font-black text-royal-blue outline-none">
                               {allDepartments.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                             </select>
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Nome do Cargo</label>
                             <input required value={roleForm.roleName} onChange={e=>setRoleForm({...roleForm, roleName: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-xs font-bold text-royal-blue outline-none" placeholder="Ex: Coordenador" />
                           </div>
                        </div>
                        <button type="submit" className="w-full bg-royal-blue text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-blue-900 transition-all flex items-center justify-center gap-3">Anexar Cargo</button>
                      </form>
                   </div>
                </div>
             )}

             {canManage && (
                <div className="p-12 bg-blue-50 rounded-[4rem] border-2 border-blue-100 relative shadow-inner">
                   <h3 className="text-2xl font-black text-royal-blue mb-12 flex items-center gap-5 uppercase tracking-tight"><UserPlus size={32} /> Registrar Colaborador</h3>
                   <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-royal-blue uppercase ml-2 tracking-widest">Nome Completo</label>
                        <input required value={newUserForm.name} onChange={e=>setNewUserForm({...newUserForm, name: e.target.value})} className="w-full bg-white border-2 border-royal-blue/10 rounded-2xl px-6 py-4 text-xs font-bold text-royal-blue focus:border-royal-blue transition-all shadow-sm outline-none" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-royal-blue uppercase ml-2 tracking-widest">Lotação</label>
                        <select 
                          value={newUserForm.dept} 
                          onChange={e=>setNewUserForm({...newUserForm, dept: e.target.value})} 
                          className="w-full bg-white border-2 border-royal-blue/10 rounded-2xl px-6 py-4 text-xs font-black text-royal-blue outline-none shadow-sm"
                        >
                          {allDepartments.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-royal-blue uppercase ml-2 tracking-widest">Função Atribuída</label>
                        <select 
                          value={newUserForm.role} 
                          onChange={e=>setNewUserForm({...newUserForm, role: e.target.value})} 
                          className="w-full bg-white border-2 border-royal-blue/10 rounded-2xl px-6 py-4 text-xs font-black text-royal-blue outline-none shadow-sm"
                        >
                          {(allDepartments.find(d => d.id === newUserForm.dept)?.roles || []).map((r: string) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button type="submit" className="w-full bg-royal-blue text-white py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-900 transition-all active:scale-95 flex items-center justify-center gap-3">
                           <ShieldPlus size={20} /> Ativar Conta
                        </button>
                      </div>
                   </form>
                </div>
             )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
