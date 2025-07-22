import { Attendance } from 'src/attendances/entities/attendance.entity';
import { Contract } from 'src/contracts/entities/contract.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Leaf } from 'src/leaves/entities/leaf.entity';
import { Payroll } from 'src/payrolls/entities/payroll.entity';
import { PerformanceReview } from 'src/performance_reviews/entities/performance_review.entity';
import { Position } from 'src/positions/entities/position.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { TeamMember } from 'src/team_members/entities/team_member.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
@Entity('employees')
export class Employee extends BaseEntity {
  @Column()
  full_name: string;
  @Column()
  gender: string;
  @Column()
  dob: Date;
  @Column()
  phone: string;
  @Column({
    type: 'text',
  })
  address: string;
  @Column()
  joined_date: Date;
  @Column({
    type: 'text',
    default: '',
  })
  avatar_url: string;
  // Many-to-One: Nhân viên thuộc về một phòng ban
  @ManyToOne(() => Department, department => department.employees, {
    nullable: true,
  })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => Employee, employee => employee.subordinates, {
    nullable: true,
  })
  @JoinColumn({ name: 'manager_id' })
  manager: Employee;

  // Một nhân viên có thể quản lý nhiều nhân viên khác
  @OneToMany(() => Employee, employee => employee.manager)
  subordinates: Employee[];

  @ManyToOne(() => Position, position => position.employees)
  @JoinColumn({ name: 'position_id' })
  position: Position;

  @OneToMany(() => Team, team => team.leader)
  teams: Team[];

  @OneToMany(() => TeamMember, team_member => team_member.employee)
  team_members: TeamMember[];

  @OneToMany(() => Contract, contract => contract.employee)
  contracts: Contract[];

  @OneToMany(() => Leaf, leaf => leaf.employee)
  leaves: Leaf[];

  @OneToMany(() => Leaf, leaf => leaf.approvedBy)
  approvedLeaves: Leaf[];

  @OneToMany(() => Attendance, attendance => attendance.employee)
  attendances: Attendance[];

  @OneToMany(() => Payroll, payroll => payroll.employee)
  payrolls: Payroll[];

  @OneToMany(
    () => PerformanceReview,
    performanceReview => performanceReview.employee,
  )
  performanceReviews: PerformanceReview[];

  @OneToMany(
    () => PerformanceReview,
    performanceReview => performanceReview.reviews,
  )
  reviews: PerformanceReview[];
}
