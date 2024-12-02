export type ClientType = 'Individual' | 'Company';

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  email: string;
  phone: string;
  location: string;
  responsibleAttorney: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientStats {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  individualClients: number;
  companyClients: number;
}

export interface ClientMatter {
  id: string;
  clientId: string;
  matterName: string;
  status: string;
  startDate: Date;
  lastActivity: Date;
}

export interface ClientBilling {
  id: string;
  clientId: string;
  totalBilled: number;
  totalPaid: number;
  outstandingAmount: number;
  lastPaymentDate?: Date;
} 