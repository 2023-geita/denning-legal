export interface Task {
  id: string;
  name: string;
  matterId: string;
  matterName: string;
  description: string;
  dueDate: Date;
  assignedAttorney: string;
  status: 'Pending' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: Date;
  updatedAt: Date;
  reminder: boolean;
  reminderDate?: Date;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  upcomingTasks: number;
} 