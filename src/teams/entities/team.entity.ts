import { Department } from 'src/departments/entities/department.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { TeamMember } from 'src/team_members/entities/team_member.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('teams')
export class Team extends BaseEntity {
  @Column()
  name: string;
  @ManyToOne(() => Department, department => department.teams)
  @JoinColumn({ name: 'department_id' })
  department: Department;
  @ManyToOne(() => Employee, employee => employee.teams)
  @JoinColumn({ name: 'leader_id' })
  leader: Employee;
  @OneToMany(() => TeamMember, team_member => team_member.team)
  team_members: TeamMember[];
}
