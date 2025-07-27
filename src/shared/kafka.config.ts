import { Kafka, logLevel } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'manager-app',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
  logLevel: logLevel.INFO,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

// Kafka Topics
export const KAFKA_TOPICS = {
  PAYROLL_PROCESSING: 'payroll.processing',
  PAYROLL_COMPLETED: 'payroll.completed',
  PAYROLL_FAILED: 'payroll.failed',
  EMPLOYEE_UPDATED: 'employee.updated',
  ATTENDANCE_CALCULATED: 'attendance.calculated',
} as const;

// Consumer Groups
export const KAFKA_CONSUMER_GROUPS = {
  PAYROLL_SERVICE: 'payroll-service-group',
  NOTIFICATION_SERVICE: 'notification-service-group',
  AUDIT_SERVICE: 'audit-service-group',
} as const;
