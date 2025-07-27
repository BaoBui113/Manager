import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { ProcessPayrollJobData } from './dto/payroll-jobs.dto';
import { Payroll } from './entities/payroll.entity';

@Processor('payroll')
export class PayrollProcessor extends WorkerHost {
  private readonly logger = new Logger(PayrollProcessor.name);

  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {
    super();
  }

  async process(job: Job<ProcessPayrollJobData>): Promise<void> {
    const { payrollId, userId, employeeId } = job.data;

    this.logger.log(
      `Processing payroll job ${job.id} for payroll ${payrollId}`,
    );

    try {
      // Simulate payroll calculation time (in production, replace with real logic)
      // Real processing would include:
      // - Fetching attendance data
      // - Calculating overtime, bonuses, deductions
      // - Tax calculations
      // - Generating payslip PDF
      // - Updating accounting systems
      await this.delay(2000); // 2 seconds to simulate real processing time

      // Update progress
      await job.updateProgress(50);

      // Get payroll with employee data
      const payroll = await this.payrollRepository.findOne({
        where: { id: payrollId },
        relations: ['employee'],
      });

      if (!payroll) {
        throw new Error(`Payroll ${payrollId} not found`);
      }

      // Calculate salary (simplified logic)
      const baseSalary = payroll.employee.base_salary || 10000000; // 10M VND default
      const bonus = payroll.bonus || 0;
      const deductions = payroll.deduction || 0;
      const totalSalary = baseSalary + bonus - deductions;

      // Update payroll with calculated values
      await this.payrollRepository.update(payrollId, {
        base_salary: baseSalary,
        total: totalSalary,
        status: 'completed',
        processed_at: new Date(),
      });

      this.logger.log(
        `Payroll ${payrollId} completed successfully. Total: ${totalSalary} VND`,
      );

      // Update job progress
      await job.updateProgress(100);
    } catch (error) {
      this.logger.error(`Error processing payroll ${payrollId}:`, error);

      // Update payroll status to failed
      await this.payrollRepository.update(payrollId, {
        status: 'failed',
        processed_at: new Date(),
      });

      // Re-throw error for BullMQ retry mechanism
      throw error;
    }
  }

  // Utility method
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
