import { BullModule } from '@nestjs/bullmq';

export const bullMQConfig = BullModule.forRoot({
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
});

// Queue names
export const QUEUE_NAMES = {
  PAYROLL: 'payroll',
  NOTIFICATION: 'notification',
  AUDIT: 'audit',
} as const;

// Job types
export const JOB_TYPES = {
  PROCESS_PAYROLL: 'process-payroll',
  SEND_PAYROLL_NOTIFICATION: 'send-payroll-notification',
  LOG_PAYROLL_ACTIVITY: 'log-payroll-activity',
} as const;
