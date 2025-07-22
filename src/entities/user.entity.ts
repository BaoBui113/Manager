import { AuditLog } from 'src/audit_logs/entities/audit_log.entity';
import { JobPost } from 'src/job_posts/entities/job_post.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { UserRole } from 'src/user_roles/entities/user_role.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => JobPost, jobPost => jobPost.user)
  jobPosts: JobPost[];

  @OneToMany(() => AuditLog, auditLog => auditLog.user)
  auditLogs: AuditLog[];

  @OneToMany(() => Notification, notifications => notifications.recipient)
  notifications: Notification[];
}
