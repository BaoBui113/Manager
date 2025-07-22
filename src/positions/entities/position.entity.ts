import { Employee } from 'src/employees/entities/employee.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
@Entity('positions')
export class Position extends BaseEntity {
  @Column()
  title: string;
  @Column()
  level: string;
  @Column({
    type: 'text',
    default: '',
  })
  description: string;

  @OneToMany(() => Employee, employee => employee.position)
  employees: Employee[];
}
