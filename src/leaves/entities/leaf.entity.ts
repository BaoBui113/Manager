import { Employee } from 'src/employees/entities/employee.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
@Entity('leaves')
export class Leaf extends BaseEntity {
  @Column()
  leave_type: string;
  @Column()
  start_date: Date;
  @Column()
  end_date: Date;
  @Column()
  status: string; // e.g., 'pending', 'approved', 'rejected'
  @Column()
  requested_at: Date;
  @Column()
  approved_at: Date;
  @ManyToOne(() => Employee, employee => employee.leaves)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
  @ManyToOne(() => Employee, employee => employee.approvedLeaves)
  @JoinColumn({ name: 'approved_by' })
  approvedBy: Employee;
}
