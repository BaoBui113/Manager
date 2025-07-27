import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { JOB_TYPES } from '../shared/bullmq.config';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { ProcessPayrollJobData } from './dto/payroll-jobs.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { Payroll } from './entities/payroll.entity';

@Injectable()
export class PayrollsService {
  private readonly logger = new Logger(PayrollsService.name);

  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectQueue('payroll')
    private payrollQueue: Queue<ProcessPayrollJobData>,
  ) {}

  // Tạo payroll và add job to queue
  async create(createPayrollDto: CreatePayrollDto, userId: string) {
    try {
      // Validate employee exists
      const employee = await this.employeeRepository.findOne({
        where: { id: createPayrollDto.employee_id },
      });

      if (!employee) {
        throw new Error(
          `Employee with ID ${createPayrollDto.employee_id} not found`,
        );
      }

      // Create payroll record với status processing
      const payroll = this.payrollRepository.create({
        ...createPayrollDto,
        status: 'processing',
      });

      const savedPayroll = await this.payrollRepository.save(payroll);

      // Add job to BullMQ queue thay vì gửi Kafka event
      const jobData: ProcessPayrollJobData = {
        payrollId: savedPayroll.id,
        userId,
        employeeId: savedPayroll.employee_id,
        month: savedPayroll.month,
        year: savedPayroll.year,
      };

      await this.payrollQueue.add(JOB_TYPES.PROCESS_PAYROLL, jobData, {
        attempts: 3, // Retry 3 lần nếu fail
        backoff: {
          type: 'exponential', // Exponential backoff
          delay: 2000,
        },
        delay: 1000, // Delay 1s trước khi xử lý
        removeOnComplete: 10, // Giữ 10 jobs completed gần nhất
        removeOnFail: 5, // Giữ 5 jobs failed gần nhất
      });

      this.logger.log(
        `Payroll ${savedPayroll.id} created and queued for processing`,
      );

      return savedPayroll;
    } catch (error) {
      this.logger.error('Error creating payroll:', error);
      throw error;
    }
  }

  async findAll(): Promise<Payroll[]> {
    return this.payrollRepository.find({
      relations: ['employee'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Payroll> {
    const payroll = await this.payrollRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!payroll) {
      throw new Error(`Payroll with ID ${id} not found`);
    }

    return payroll;
  }

  async update(
    id: number,
    updatePayrollDto: UpdatePayrollDto,
  ): Promise<Payroll> {
    await this.payrollRepository.update(id, updatePayrollDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.payrollRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Payroll with ID ${id} not found`);
    }
  }

  // Get queue stats for monitoring
  async getQueueStats() {
    const waiting = await this.payrollQueue.getWaiting();
    const active = await this.payrollQueue.getActive();
    const completed = await this.payrollQueue.getCompleted();
    const failed = await this.payrollQueue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }
}
