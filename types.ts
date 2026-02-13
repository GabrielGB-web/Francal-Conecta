
export type Department = string;
export type Role = string;

export interface UserProfile {
  id: string;
  name: string;
  dept: Department;
  role: Role;
}

export type TicketStatus = 'Aberto' | 'Em Andamento' | 'Concluído' | 'Cancelado';
export type Priority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';

export interface TicketMessage {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  fromDepartment: Department;
  toDepartment: Department;
  createdBy: string;
  createdById: string;
  assignedTo?: string;
  assignedToId?: string;
  createdAt: Date;
  status: TicketStatus;
  priority: Priority;
  messages: TicketMessage[];
}

export interface DeptDashboardStats {
  dept: Department;
  metrics: {
    label: string;
    value: string;
    trend?: string;
    isPositive?: boolean;
  }[];
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'Ativa' | 'Encerrada';
  department: Department;
  startDate: Date;
  endDate?: Date;
}

export interface Announcement {
  id: string;
  department: Department;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  date: Date;
}
