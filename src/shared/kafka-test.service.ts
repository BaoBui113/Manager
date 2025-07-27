import { Injectable, Logger } from '@nestjs/common';
import { AttendanceCalculatedEvent } from '../payrolls/dto/payroll.events';
import { KAFKA_TOPICS } from '../shared/kafka.config';
import { KafkaService } from '../shared/kafka.service';

@Injectable()
export class KafkaTestService {
  private readonly logger = new Logger(KafkaTestService.name);

  constructor(private kafkaService: KafkaService) {}

  // Test gửi attendance event (giả lập từ AttendanceService)
  async simulateAttendanceCalculated(
    employeeId: number,
    month: number,
    year: number,
  ) {
    const event: AttendanceCalculatedEvent = {
      id: Date.now().toString(),
      employeeId: employeeId.toString(),
      month,
      year,
      totalDays: 30,
      workingDays: 22,
      lateDays: 2,
      timestamp: new Date(),
    };

    await this.kafkaService.sendMessage(
      KAFKA_TOPICS.ATTENDANCE_CALCULATED,
      event,
    );
    this.logger.log('Sent attendance calculated event');
    return event;
  }

  // Test tạo payroll trực tiếp
  async testCreatePayroll(employeeId: number) {
    try {
      // Simulate attendance calculation
      await this.simulateAttendanceCalculated(employeeId, 12, 2024);

      this.logger.log('Test completed - check PayrollService logs');
    } catch (error) {
      this.logger.error('Test failed:', error);
    }
  }
}
