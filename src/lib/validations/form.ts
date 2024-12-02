import { z } from 'zod';

// Matter form validation schema
export const matterSchema = z.object({
  client: z.string().min(1, 'Client is required'),
  status: z.enum(['Open', 'Pending', 'Closed']),
  notes: z.string().optional(),
  originatingAttorney: z.string().min(1, 'Originating attorney is required'),
  responsibleAttorney: z.string().min(1, 'Responsible attorney is required'),
  courtLocation: z.string().optional(),
  practiceArea: z.string().min(1, 'Practice area is required'),
  caseNumber: z.string().min(1, 'Case number is required')
});

// Client form validation schema
export const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['Individual', 'Company']),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  location: z.string().optional(),
  responsibleAttorney: z.string().min(1, 'Responsible attorney is required'),
  status: z.enum(['Active', 'Inactive'])
});

// Document form validation schema
export const documentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  type: z.string().min(1, 'Document type is required'),
  url: z.string().url('Invalid URL format'),
  status: z.enum(['Draft', 'Final', 'Archived'])
});

// Session form validation schema
export const sessionSchema = z.object({
  matterId: z.string().min(1, 'Matter ID is required'),
  startTime: z.date(),
  endTime: z.date().optional(),
  duration: z.number().min(0).optional(),
  notes: z.string().optional()
});

// Task form validation schema
export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed', 'Cancelled']),
  priority: z.enum(['Low', 'Medium', 'High']),
  dueDate: z.date().optional(),
  assignedTo: z.string().optional(),
  matterId: z.string().optional()
});

// Billing form validation schema
export const billingSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  matterId: z.string().min(1, 'Matter ID is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  status: z.enum(['Paid', 'Unpaid', 'Overdue']),
  dueDate: z.date(),
  description: z.string().optional()
});

// Matter deadline validation schema
export const deadlineSchema = z.object({
  matterId: z.string().min(1, 'Matter ID is required'),
  matterOpens: z.date(),
  matterCloses: z.date(),
  matterDue: z.date(),
  statuteOfLimitations: z.date()
}).refine(data => {
  return data.matterOpens < data.matterCloses &&
         data.matterOpens <= data.matterDue &&
         data.matterDue <= data.statuteOfLimitations;
}, {
  message: "Dates must be in chronological order: opens → due → closes → statute of limitations"
}); 