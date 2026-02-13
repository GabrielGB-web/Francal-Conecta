
import React from 'react';
import { 
  Briefcase, 
  Users, 
  Settings, 
  Truck, 
  Monitor, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck,
  LayoutDashboard,
  Ticket as TicketIcon,
  HeartHandshake,
  CreditCard,
  Scale,
  Archive
} from 'lucide-react';
import { Department } from './types';

export const SYSTEM_NAME = "FRANCAL CONECTA";

export interface DeptInfo {
  id: Department;
  label: string;
  icon: React.ReactNode;
  color: string;
  themeColor: string;
  roles: string[];
}

export const DEPARTMENTS: DeptInfo[] = [
  { 
    id: 'Comercial', 
    label: 'Comercial', 
    icon: <TrendingUp size={18} />, 
    color: 'bg-green-500', 
    themeColor: '#22c55e',
    roles: ['Diretor', 'Gerente', 'Supervisor', 'Vendedor', 'Suporte']
  },
  { 
    id: 'Financeiro', 
    label: 'Financeiro', 
    icon: <DollarSign size={18} />, 
    color: 'bg-blue-500', 
    themeColor: '#3b82f6',
    roles: ['Gerente', 'Supervisor', 'Financeiro']
  },
  { 
    id: 'Diretoria', 
    label: 'Diretoria', 
    icon: <ShieldCheck size={18} />, 
    color: 'bg-royal-blue', 
    themeColor: '#002366',
    roles: ['Donos', 'Diretores', 'Gerentes']
  },
  { 
    id: 'TI', 
    label: 'TI', 
    icon: <Monitor size={18} />, 
    color: 'bg-gray-800', 
    themeColor: '#1f2937',
    roles: ['Gerente', 'TI']
  },
  { 
    id: 'Logística', 
    label: 'Logística', 
    icon: <Truck size={18} />, 
    color: 'bg-orange-600', 
    themeColor: '#ea580c',
    roles: ['Gerente', 'Supervisor', 'Encarregado', 'Separador', 'Motorista', 'Faturamento']
  },
  { 
    id: 'RH', 
    label: 'RH', 
    icon: <HeartHandshake size={18} />, 
    color: 'bg-pink-500', 
    themeColor: '#ec4899',
    roles: ['Gerente RH', 'Gerente Departamento Pessoal', 'RH', 'Departamento RH']
  },
  { 
    id: 'Crédito', 
    label: 'Crédito', 
    icon: <CreditCard size={18} />, 
    color: 'bg-indigo-500', 
    themeColor: '#6366f1',
    roles: ['Gerente Crédito', 'Supervisor Crédito', 'Crédito']
  },
  { 
    id: 'Fiscal', 
    label: 'Fiscal', 
    icon: <Scale size={18} />, 
    color: 'bg-amber-600', 
    themeColor: '#d97706',
    roles: ['Gerente Fiscal', 'Fiscal']
  },
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'tickets', label: 'Central de Suporte', icon: <TicketIcon size={20} /> },
  { id: 'archive', label: 'Arquivo Geral', icon: <Archive size={20} /> },
  { id: 'departments', label: 'Portais Internos', icon: <Users size={20} /> },
  { id: 'settings', label: 'Gerenciamento', icon: <Settings size={20} /> },
];
