export interface BillableSession {
  id: string;
  matterId: string;
  matterName: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  notes: string;
  attorney: string;
  billingRate: number;
  date: Date;
  status: 'Ongoing' | 'Completed' | 'Planned' | 'Paused';
  billable: boolean;
}

export interface SessionStats {
  totalHours: number;
  billableHours: number;
  totalSessions: number;
  averageSessionDuration: number;
} 