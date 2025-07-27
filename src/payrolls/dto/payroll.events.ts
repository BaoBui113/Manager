export class PayrollProcessingEvent {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  userId: string; // User tạo payroll
  timestamp: Date;
}

export class PayrollCompletedEvent {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  totalSalary: number;
  deductions: number;
  bonus: number;
  status: 'completed';
  timestamp: Date;
}

export class PayrollFailedEvent {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  error: string;
  status: 'failed';
  timestamp: Date;
}

export class EmployeeUpdatedEvent {
  id: string;
  employeeId: string;
  userId: string;
  changes: Record<string, any>;
  timestamp: Date;
}

export class AttendanceCalculatedEvent {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  totalDays: number;
  workingDays: number;
  lateDays: number;
  timestamp: Date;
}
