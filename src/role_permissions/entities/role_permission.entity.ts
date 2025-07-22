import { Permission } from 'src/permissions/entities/permission.entity';
import { Role } from 'src/roles/entities/role.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('role_permissions')
export class RolePermission extends BaseEntity {
  @ManyToOne(() => Role, role => role.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;
  @ManyToOne(() => Permission, permission => permission.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}
