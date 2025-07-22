import { Employee } from 'src/employees/entities/employee.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('payrolls')
export class Payroll extends BaseEntity {
  @Column()
  month: Date;
  @Column()
  base_salary: number;
  @Column()
  bonus: number;
  @Column()
  deduction: number;
  @Column()
  total: number;
  @Column({
    type: 'boolean',
    default: false,
  })
  is_locked: boolean; // Indicates if the payroll is finalized and cannot be modified
  @ManyToOne(() => Employee, employee => employee.payrolls)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
