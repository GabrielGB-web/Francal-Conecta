
import React, { useState } from 'react';
import { Ticket, DeptDashboardStats, UserProfile } from '../types.ts';
import { Activity, CheckCircle, Ticket as TicketIcon, Edit3, Save, X, DollarSign, AlertCircle, BarChart3, Plus, Trash2, TrendingUp, Zap, Target, Star } from 'lucide-react';

interface DashboardProps {
  tickets: Ticket[];
  user: UserProfile;
  deptStats: DeptDashboardStats[];
  updateStats: (dept: DeptDashboardStats) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tickets, user, deptStats, updateStats }) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentDeptStats = deptStats.find(s => s.dept === user.dept) || { dept: user.dept, metrics: [] };
  const [tempStats, setTempStats] = useState<DeptDashboardStats>(JSON.parse(JSON.stringify(currentDeptStats)));

  // Diretoria e TI são superusers
  const isSuperUser = user.dept === 'TI' || user.dept === 'Diretoria';
  const isManager = isSuperUser || user.role === 'Gerente' || user.role === 'Supervisor';

  const handleSave = () => {
    updateStats(tempStats);
    setIsEditing(false);
  };

  const addMetric = () => {
    setTempStats({
      ...tempStats,
      metrics: [...tempStats.metrics, { label: 'Novo KPI', value: '0' }]
    });
  };

  const removeMetric = (index: number) => {
    const newMetrics = tempStats.metrics.filter((_, i) => i !== index);
    setTempStats({ ...tempStats, metrics: newMetrics });
  };

  const relevantTickets = isSuperUser || user.role === 'Gerente' || user.role === 'Supervisor'
    ? tickets.filter(t => t.toDepartment === user.dept || t.fromDepartment === user.dept || isSuperUser)
    : tickets.filter(t => t.createdById === user.id || t.assignedToId === user.id);

  // Paleta de cores para os fundos
  const kpiColors = [
    { bg: 'bg-blue-50', iconBg: 'bg-blue-600', border: 'border-blue-200', icon: <Activity size={20} /> },
    { bg: 'bg-emerald-50', iconBg: 'bg-emerald-600', border: 'border-emerald-200', icon: <TrendingUp size={20} /> },
    { bg: 'bg-indigo-50', iconBg: 'bg-indigo-600', border: 'border-indigo-200', icon: <Zap size={20} /> },
    { bg: 'bg-amber-50', iconBg: 'bg-amber-600', border: 'border-amber-200', icon: <Target size={20} /> },
    { bg: 'bg-rose-50', iconBg: 'bg-rose-600', border: 'border-rose-200', icon: <Star size={20} /> },
    { bg: 'bg-violet-50', iconBg: 'bg-violet-600', border: 'border-violet-200', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-royal-blue tracking-tight uppercase">Painel {user.dept}</h2>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Gestão de Indicadores Francal</p>
        </div>
        {isManager && (
          <button
            onClick={() => { setIsEditing(!isEditing); setTempStats(JSON.parse(JSON.stringify(currentDeptStats))); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md border-2 ${isEditing ? 'bg-red-50 border-red-400 text-red-600' : 'bg-white border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white'
              }`}
          >
            {isEditing ? <><X size={14} /> Cancelar</> : <><Edit3 size={14} /> Alimentar Dados</>}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-10 rounded-[3rem] border-4 border-dashed border-royal-blue/20 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-black text-royal-blue uppercase text-xs tracking-widest flex items-center gap-3">
              <Edit3 size={18} /> Editor de Painel Estratégico
            </h3>
            <button
              onClick={addMetric}
              className="bg-royal-blue text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
            >
              <Plus size={16} /> Novo KPI
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {tempStats.metrics.map((m, idx) => {
              const color = kpiColors[idx % kpiColors.length];
              return (
                <div key={idx} className={`${color.bg} p-8 rounded-[2.5rem] border-2 border-royal-blue/20 relative group shadow-sm`}>
                  <button
                    onClick={() => removeMetric(idx)}
                    className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-royal-blue uppercase ml-1 tracking-tighter">Nome do Indicador</label>
                      <input
                        className="w-full bg-white border-2 border-royal-blue/30 rounded-xl px-5 py-3 text-xs font-bold text-gray-800 outline-none focus:border-royal-blue transition-all"
                        value={m.label} onChange={e => {
                          const newMetrics = [...tempStats.metrics];
                          newMetrics[idx].label = e.target.value;
                          setTempStats({ ...tempStats, metrics: newMetrics });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-royal-blue uppercase ml-1 tracking-tighter">Valor Atual</label>
                      <input
                        className="w-full bg-white border-2 border-royal-blue/30 rounded-xl px-5 py-3 text-xs font-black text-royal-blue outline-none focus:border-royal-blue transition-all"
                        value={m.value} onChange={e => {
                          const newMetrics = [...tempStats.metrics];
                          newMetrics[idx].value = e.target.value;
                          setTempStats({ ...tempStats, metrics: newMetrics });
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={handleSave} className="w-full bg-royal-blue text-white py-6 rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-blue-900 transition-all active:scale-95 flex items-center justify-center gap-4">
            <Save size={24} /> Publicar no Painel Principal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentDeptStats.metrics.map((stat, i) => {
            const color = kpiColors[i % kpiColors.length];
            return (
              <div key={i} className={`${color.bg} p-8 rounded-[2.5rem] shadow-sm border-2 ${color.border} flex items-center gap-6 hover:shadow-2xl hover:border-royal-blue/30 transition-all group relative overflow-hidden`}>
                <div className="absolute -right-8 -bottom-8 opacity-[0.06] rotate-12 group-hover:scale-125 transition-transform duration-700 text-royal-blue">
                  {React.cloneElement(color.icon as React.ReactElement, { size: 160 })}
                </div>
                <div className={`${color.iconBg} text-white p-5 rounded-2xl shadow-xl relative z-10 group-hover:scale-110 transition-transform`}>
                  {color.icon}
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-royal-blue">{stat.label}</p>
                  <p className="text-3xl font-black tracking-tight text-royal-blue">{stat.value}</p>
                </div>
              </div>
            );
          })}
          {currentDeptStats.metrics.length === 0 && (
            <div className="col-span-full py-24 text-center text-royal-blue/20 bg-white rounded-[4rem] border-4 border-dashed border-gray-100">
              <BarChart3 size={80} className="mx-auto mb-6 opacity-10" />
              <p className="font-black uppercase text-sm tracking-widest">Painel aguardando alimentação de dados.</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {user.dept === 'Financeiro' && (
            <div className="bg-white p-12 rounded-[4rem] border-2 border-gray-100 shadow-sm relative overflow-hidden group">
              <h3 className="text-2xl font-black mb-10 flex items-center gap-4 text-royal-blue uppercase tracking-tight">
                <AlertCircle className="text-red-600" size={32} /> Auditoria de Inadimplência
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="p-10 bg-red-600 text-white rounded-[3rem] shadow-2xl shadow-red-900/30">
                  <p className="text-[11px] font-black opacity-90 uppercase tracking-widest mb-3">Vencidos +30 dias</p>
                  <p className="text-4xl font-black tracking-tighter">R$ 42.150</p>
                  <div className="mt-5 pt-5 border-t border-white/20 text-[10px] font-black uppercase">Crítico</div>
                </div>
                <div className="p-10 bg-amber-500 text-white rounded-[3rem] shadow-2xl shadow-amber-900/30">
                  <p className="text-[11px] font-black opacity-90 uppercase tracking-widest mb-3">Em Atraso Recente</p>
                  <p className="text-4xl font-black tracking-tighter">R$ 18.300</p>
                  <div className="mt-5 pt-5 border-t border-white/20 text-[10px] font-black uppercase">Monitoramento</div>
                </div>
                <div className="p-10 bg-green-600 text-white rounded-[3rem] shadow-2xl shadow-green-900/30">
                  <p className="text-[11px] font-black opacity-90 uppercase tracking-widest mb-3">Recuperação Mês</p>
                  <p className="text-4xl font-black tracking-tighter">R$ 112.900</p>
                  <div className="mt-5 pt-5 border-t border-white/20 text-[10px] font-black uppercase">Meta Batida</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-12 rounded-[4rem] shadow-sm border-2 border-gray-100">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black flex items-center gap-4 text-royal-blue uppercase tracking-tight">
                <TicketIcon className="text-royal-blue" size={32} />
                Demandas Urgentes
              </h3>
              <span className="bg-royal-blue/10 text-royal-blue px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Sincronizado</span>
            </div>
            <div className="space-y-5">
              {relevantTickets.slice(0, 5).map(ticket => (
                <div key={ticket.id} className="flex items-center justify-between p-8 rounded-[3rem] bg-gray-50/50 hover:bg-white border-2 border-transparent hover:border-royal-blue/20 hover:shadow-2xl transition-all group">
                  <div className="flex items-center gap-6">
                    <div className={`w-3 h-12 rounded-full ${ticket.priority === 'Urgente' ? 'bg-red-600 animate-pulse' : 'bg-royal-blue'}`}></div>
                    <div>
                      <p className="font-black text-royal-blue text-lg group-hover:translate-x-1 transition-transform">{ticket.title}</p>
                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                        ID: {ticket.id} • {ticket.assignedTo ? `Técnico: ${ticket.assignedTo}` : 'Não Atribuído'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[11px] px-6 py-3 rounded-2xl font-black uppercase tracking-widest shadow-md border-2 ${ticket.status === 'Aberto' ? 'bg-red-100 border-red-200 text-red-700' :
                        ticket.status === 'Em Andamento' ? 'bg-orange-100 border-orange-200 text-orange-700' : 'bg-green-100 border-green-200 text-green-700'
                      }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
              {relevantTickets.length === 0 && (
                <div className="py-24 text-center text-royal-blue/10">
                  <CheckCircle size={80} className="mx-auto mb-6 opacity-10" />
                  <p className="font-black uppercase tracking-widest text-sm text-gray-400">Tudo em conformidade.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* REDESIGN ACESSO RÁPIDO - AGORA COM TEXTO AZUL ROYAL SEMPRE VISÍVEL */}
          <div className="bg-blue-50 p-12 rounded-[4rem] border-2 border-royal-blue/20 shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-royal-blue/5 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
            <h3 className="text-xl font-black mb-10 flex items-center gap-4 text-royal-blue uppercase tracking-widest border-b border-royal-blue/10 pb-6">Acesso Rápido</h3>
            <div className="space-y-5">
              {[
                { label: 'Relatórios Mensais', icon: <BarChart3 size={20} /> },
                { label: 'Base de Dados', icon: <Target size={20} /> },
                { label: 'Normas Francal', icon: <ShieldCheck size={20} /> }
              ].map((item, i) => (
                <button key={i} className="w-full bg-white hover:bg-royal-blue hover:text-white p-6 rounded-[2rem] text-left border-2 border-royal-blue/10 transition-all text-[11px] font-black uppercase tracking-widest flex justify-between items-center group/btn shadow-md text-royal-blue">
                  <span className="flex items-center gap-4">{item.icon} {item.label}</span>
                  <div className="w-9 h-9 rounded-xl bg-royal-blue/5 flex items-center justify-center group-hover/btn:bg-white/20 group-hover/btn:translate-x-2 transition-all">→</div>
                </button>
              ))}
            </div>
          </div>

          {/* REDESIGN PERFORMANCE SLA - CORES AZUL ROYAL */}
          <div className="bg-white p-12 rounded-[4rem] border-2 border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-6 right-10 text-royal-blue">
              <Activity size={28} className="animate-pulse" />
            </div>
            <h3 className="text-xl font-black mb-10 text-royal-blue uppercase tracking-widest border-b border-gray-50 pb-6">Índice de SLA</h3>
            <div className="space-y-8">
              <div className="p-10 bg-blue-50/50 rounded-[3rem] border-2 border-blue-100 shadow-inner">
                <div className="flex justify-between items-center mb-5">
                  <p className="text-[12px] font-black text-royal-blue uppercase tracking-widest">Performance</p>
                  <span className="text-3xl font-black text-royal-blue">92%</span>
                </div>
                <div className="h-5 bg-white rounded-full overflow-hidden shadow-inner border-2 border-royal-blue/10 p-1">
                  <div className="h-full bg-royal-blue rounded-full w-[92%] shadow-lg shadow-royal-blue/20"></div>
                </div>
                <p className="text-[10px] text-royal-blue font-black mt-6 uppercase tracking-widest text-center border-t border-royal-blue/5 pt-5">Operação em nível de excelência</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente simples para ícone de proteção
const ShieldCheck = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
);

export default Dashboard;
