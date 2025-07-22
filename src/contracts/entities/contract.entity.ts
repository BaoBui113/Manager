import { Employee } from 'src/employees/entities/employee.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('contracts')
export class Contract extends BaseEntity {
  @Column()
  type: string;
  @Column()
  signed_date: Date;
  @Column()
  start_date: Date;
  @Column()
  end_date: Date;
  @Column()
  salary_base: number;
  @Column({
    type: 'text',
  })
  note: string;
  @ManyToOne(() => Employee, employee => employee.contracts)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
