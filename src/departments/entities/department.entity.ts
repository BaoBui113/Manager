import { Employee } from 'src/employees/entities/employee.entity';
import { JobPost } from 'src/job_posts/entities/job_post.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Team } from 'src/teams/entities/team.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity('departments')
export class Department extends BaseEntity {
  @Column({ type: 'text', unique: true })
  name: string;
  // One-to-One: Manager của phòng ban
  @OneToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'manager_id' })
  manager: Employee;
  // One-to-Many: Phòng ban có nhiều nhân viên
  @OneToMany(() => Employee, employee => employee.department)
  employees: Employee[];

  @OneToMany(() => Team, team => team.department)
  teams: Team[];

  @OneToMany(() => JobPost, job => job.department)
  jobPosts: JobPost[];
}
