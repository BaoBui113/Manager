export interface ProcessPayrollJobData {
  payrollId: number;
  userId: string;
  employeeId: number;
  month: number;
  year: number;
}

export interface PayrollNotificationJobData {
  payrollId: number;
  employeeId: number;
  status: 'completed' | 'failed';
  totalSalary?: number;
  error?: string;
}

export interface PayrollAuditJobData {
  payrollId: number;
  action: 'created' | 'processed' | 'completed' | 'failed';
  userId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
