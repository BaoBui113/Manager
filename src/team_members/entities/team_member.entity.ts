import { Employee } from 'src/employees/entities/employee.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Team } from 'src/teams/entities/team.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('team_members')
export class TeamMember extends BaseEntity {
  @Column()
  role_in_team: string;
  @Column()
  joined_at: Date;
  @ManyToOne(() => Employee, employee => employee.team_members)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
  @ManyToOne(() => Team, team => team.team_members)
  @JoinColumn({ name: 'team_id' })
  team: Team;
}
