import { User } from 'src/entities/user.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @Column({
    type: 'text',
  })
  action: string;
  @Column()
  target_table: string;
  @Column()
  target_id: number;
  @Column({
    type: 'jsonb',
  })
  data: Record<string, any>;
  @ManyToOne(() => User, user => user.auditLogs)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
