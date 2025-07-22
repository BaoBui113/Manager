import { RolePermission } from 'src/role_permissions/entities/role_permission.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { UserRole } from 'src/user_roles/entities/user_role.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  name: string;
  @Column({
    type: 'text',
  })
  description: string;

  @OneToMany(() => RolePermission, rolePermission => rolePermission.role)
  rolePermissions: RolePermission[];

  @OneToMany(() => UserRole, userRole => userRole.role)
  userRoles: UserRole[];
}
