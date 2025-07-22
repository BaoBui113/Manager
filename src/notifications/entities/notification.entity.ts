import { User } from 'src/entities/user.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column({ type: 'text' })
  message: string;
  @Column({ type: 'boolean', default: false })
  is_read: boolean;
  @Column({ type: 'varchar' })
  type: string;
  @ManyToOne(() => User, user => user.notifications)
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;
}
