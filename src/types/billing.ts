import { PaymentMethod } from '@prisma/client';

export interface Bill {
  id: string;
  clientId: string;
  clientName: string;
  matterId: string;
  matterName: string;
  totalCost: number;
  paidAmount: number;
  retainerFee: number;
  retainerDue: Date;
  unpaidBalance: number;
  status: 'Pending' | 'Paid';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  billId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  reference: string;
  notes: string;
}

export interface BillingStats {
  totalBilled: number;
  totalPaid: number;
  totalUnpaid: number;
  totalRetainers: number;
  overdueAmount: number;
  pendingBills: number;
}

export interface BillingRate {
  id: string;
  attorneyId: string;
  attorneyName: string;
  rate: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
} 