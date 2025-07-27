import { Employee } from 'src/employees/entities/employee.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('payrolls')
export class Payroll extends BaseEntity {
  @ManyToOne(() => Employee, employee => employee.payrolls)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'employee_id' })
  employee_id: number;

  @Column()
  month: number; // 1-12

  @Column()
  year: number; // 2024, 2025, etc.

  @Column({ name: 'base_salary', type: 'decimal', precision: 15, scale: 2 })
  base_salary: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  bonus: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  deduction: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  })
  status: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_locked: boolean; // Indicates if the payroll is finalized and cannot be modified

  @Column({ name: 'processed_at', type: 'timestamp', nullable: true })
  processed_at: Date;
}
