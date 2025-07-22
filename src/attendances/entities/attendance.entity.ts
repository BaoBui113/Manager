import { Employee } from 'src/employees/entities/employee.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
@Entity('attendances')
export class Attendance extends BaseEntity {
  @Column()
  check_in: Date;
  @Column()
  check_out: Date;
  @Column()
  working_hours: number;
  @Column()
  date: Date;
  @ManyToOne(() => Employee, employee => employee.attendances)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
