import { prisma } from '@/lib/prisma';
import { Bill, Payment, BillingStats } from '@/types/billing';
import { PaymentMethod } from '@prisma/client';

export class BillingService {
  static async createBill(data: Omit<Bill, 'id' | 'createdAt' | 'updatedAt' | 'paidAmount'>) {
    return prisma.bill.create({
      data: {
        ...data,
        paidAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        client: true,
        payments: true,
      },
    });
  }

  static async updateBill(id: string, data: Partial<Bill>) {
    return prisma.bill.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        client: true,
        payments: true,
      },
    });
  }

  static async deleteBill(id: string) {
    await prisma.$transaction([
      prisma.payment.deleteMany({ where: { billId: id } }),
      prisma.bill.delete({ where: { id } }),
    ]);
  }

  static async getBill(id: string) {
    return prisma.bill.findUnique({
      where: { id },
      include: {
        client: true,
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
    });
  }

  static async getBills(filters?: {
    status?: Bill['status'];
    clientId?: string;
    matterId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return prisma.bill.findMany({
      where: {
        status: filters?.status,
        clientId: filters?.clientId,
        matterId: filters?.matterId,
        createdAt: {
          gte: filters?.startDate,
          lte: filters?.endDate,
        },
      },
      include: {
        client: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async addPayment(billId: string, data: Omit<Payment, 'id' | 'billId'>) {
    const paymentData = {
      ...data,
      paymentMethod: data.paymentMethod as PaymentMethod,
    };

    const payment = await prisma.payment.create({
      data: {
        ...paymentData,
        billId,
      },
    });

    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: { payments: true },
    });

    if (bill) {
      const totalPaid = bill.payments.reduce((sum, p) => sum + p.amount, 0);
      await prisma.bill.update({
        where: { id: billId },
        data: {
          paidAmount: totalPaid,
          status: totalPaid >= bill.totalCost ? 'Paid' : 'Pending',
          updatedAt: new Date(),
        },
      });
    }

    return payment;
  }

  static async deletePayment(billId: string, paymentId: string) {
    await prisma.payment.delete({
      where: { id: paymentId },
    });

    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: { payments: true },
    });

    if (bill) {
      const totalPaid = bill.payments.reduce((sum, p) => sum + p.amount, 0);
      await prisma.bill.update({
        where: { id: billId },
        data: {
          paidAmount: totalPaid,
          status: totalPaid >= bill.totalCost ? 'Paid' : 'Pending',
          updatedAt: new Date(),
        },
      });
    }
  }

  static async getBillingStats(filters?: {
    clientId?: string;
    matterId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<BillingStats> {
    const bills = await prisma.bill.findMany({
      where: {
        clientId: filters?.clientId,
        matterId: filters?.matterId,
        createdAt: {
          gte: filters?.startDate,
          lte: filters?.endDate,
        },
      },
      include: {
        payments: true,
      },
    });

    return bills.reduce((stats, bill) => ({
      totalBilled: stats.totalBilled + bill.totalCost,
      totalPaid: stats.totalPaid + bill.paidAmount,
      totalUnpaid: stats.totalUnpaid + (bill.totalCost - bill.paidAmount),
      totalRetainers: stats.totalRetainers + bill.retainerFee,
      overdueAmount: stats.overdueAmount + (
        bill.status === 'Pending' && bill.dueDate < new Date()
          ? bill.totalCost - bill.paidAmount
          : 0
      ),
      pendingBills: stats.pendingBills + (bill.status === 'Pending' ? 1 : 0),
    }), {
      totalBilled: 0,
      totalPaid: 0,
      totalUnpaid: 0,
      totalRetainers: 0,
      overdueAmount: 0,
      pendingBills: 0,
    });
  }
} 