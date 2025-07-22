import { RolePermission } from 'src/role_permissions/entities/role_permission.entity';
import { BaseEntity } from 'src/shared/BaseEntity';
import { Column, Entity, OneToMany } from 'typeorm';
@Entity('permissions')
export class Permission extends BaseEntity {
  @Column()
  action: string;
  @Column()
  resource: string;
  @Column()
  scope: boolean;
  @OneToMany(() => RolePermission, rolePermission => rolePermission.permission)
  rolePermissions: RolePermission[];
}
