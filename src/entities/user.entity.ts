import { AuditLog } from 'src/audit_logs/entities/audit_log.entity';
import { JobPost } from 'src/job_posts/entities/job_post.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { UserRole } from 'src/user_roles/entities/user_role.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToOne(() => Employee, employee => employee.user, { cascade: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ nullable: true })
  employee_id: number;

  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => JobPost, jobPost => jobPost.user)
  jobPosts: JobPost[];

  @OneToMany(() => AuditLog, auditLog => auditLog.user)
  auditLogs: AuditLog[];

  @OneToMany(() => Notification, notifications => notifications.recipient)
  notifications: Notification[];
}
