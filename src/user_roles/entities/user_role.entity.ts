import { User } from 'src/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
@Entity('user_roles')
export class UserRole extends BaseEntity {
  @Column({
    type: 'varchar',
    default: 'all',
  })
  scope: string;

  @ManyToOne(() => Role, role => role.userRoles)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => User, user => user.userRoles)
  @JoinColumn({ name: 'user_id' })
  user: UserRole;
}
