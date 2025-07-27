import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateRolePermissionDto } from './dto/create-role_permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role_permission.dto';
import { RolePermission } from './entities/role_permission.entity';

@Injectable()
export class RolePermissionsService {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(
    createRolePermissionDto: CreateRolePermissionDto,
  ): Promise<RolePermission> {
    // Check if role exists
    const role = await this.roleRepository.findOne({
      where: { id: createRolePermissionDto.roleId },
    });
    if (!role) {
      throw new NotFoundException(
        `Role with ID ${createRolePermissionDto.roleId} not found`,
      );
    }

    // Check if permission exists
    const permission = await this.permissionRepository.findOne({
      where: { id: createRolePermissionDto.permissionId },
    });
    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${createRolePermissionDto.permissionId} not found`,
      );
    }

    // Check if role already has this permission
    const existingRolePermission = await this.rolePermissionRepository.findOne({
      where: {
        role: { id: createRolePermissionDto.roleId },
        permission: { id: createRolePermissionDto.permissionId },
      },
    });
    if (existingRolePermission) {
      throw new BadRequestException(
        'Role already has this permission assigned',
      );
    }

    const rolePermission = this.rolePermissionRepository.create({
      role: role,
      permission: permission,
    });

    return await this.rolePermissionRepository.save(rolePermission);
  }

  async findAll(): Promise<RolePermission[]> {
    return await this.rolePermissionRepository.find({
      relations: ['role', 'permission'],
      select: {
        role: {
          id: true,
          name: true,
        },
        permission: {
          id: true,
          action: true,
          resource: true,
          scope: true,
        },
      },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<RolePermission> {
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: { id },
      relations: ['role', 'permission'],
    });

    if (!rolePermission) {
      throw new NotFoundException(`RolePermission with ID ${id} not found`);
    }

    return rolePermission;
  }

  async update(
    id: number,
    updateRolePermissionDto: UpdateRolePermissionDto,
  ): Promise<RolePermission> {
    const rolePermission = await this.findOne(id);

    // If updating role or permission, check if they exist
    if (updateRolePermissionDto.roleId) {
      const role = await this.roleRepository.findOne({
        where: { id: updateRolePermissionDto.roleId },
      });
      if (!role) {
        throw new NotFoundException(
          `Role with ID ${updateRolePermissionDto.roleId} not found`,
        );
      }
      rolePermission.role = role;
    }

    if (updateRolePermissionDto.permissionId) {
      const permission = await this.permissionRepository.findOne({
        where: { id: updateRolePermissionDto.permissionId },
      });
      if (!permission) {
        throw new NotFoundException(
          `Permission with ID ${updateRolePermissionDto.permissionId} not found`,
        );
      }
      rolePermission.permission = permission;
    }

    // Check for duplicates if updating
    if (
      updateRolePermissionDto.roleId ||
      updateRolePermissionDto.permissionId
    ) {
      const existingRolePermission =
        await this.rolePermissionRepository.findOne({
          where: {
            role: { id: rolePermission.role.id },
            permission: { id: rolePermission.permission.id },
          },
        });
      if (existingRolePermission && existingRolePermission.id !== id) {
        throw new BadRequestException(
          'Role already has this permission assigned',
        );
      }
    }

    return await this.rolePermissionRepository.save(rolePermission);
  }

  async remove(id: number): Promise<{ message: string }> {
    const rolePermission = await this.findOne(id);
    await this.rolePermissionRepository.remove(rolePermission);
    return {
      message: `RolePermission assignment has been removed successfully`,
    };
  }

  // Additional helper methods
  async findByRoleId(roleId: number): Promise<RolePermission[]> {
    return await this.rolePermissionRepository.find({
      where: { role: { id: roleId } },
      relations: ['permission'],
      select: {
        permission: {
          id: true,
          action: true,
          resource: true,
          scope: true,
        },
      },
    });
  }

  async findByPermissionId(permissionId: number): Promise<RolePermission[]> {
    return await this.rolePermissionRepository.find({
      where: { permission: { id: permissionId } },
      relations: ['role'],
      select: {
        role: {
          id: true,
          name: true,
        },
      },
    });
  }

  async seedRolePermissions() {
    console.log('Starting role permissions seeding...');

    // Định nghĩa permissions cho từng role
    const rolePermissionMappings = {
      // CEO - Full access
      ceo: ['manage:all:true'],

      // CTO - Technology leadership
      cto: [
        'manage:all:true', // Full technical oversight
        'read:reports:true',
        'create:reports:true',
        'read:analytics:true',
      ],

      // Department Head - Manage entire department
      department_head: [
        'create:employees:true',
        'read:employees:true',
        'update:employees:true',
        'delete:employees:true',
        'read:departments:true',
        'update:departments:true',
        'create:teams:true',
        'read:teams:true',
        'update:teams:true',
        'delete:teams:true',
        'create:projects:true',
        'read:projects:true',
        'update:projects:true',
        'delete:projects:true',
        'read:reviews:true',
        'create:reviews:true',
        'update:reviews:true',
        'read:attendance:true',
        'update:attendance:true',
        'read:leaves:true',
        'update:leaves:true', // Approve/reject leaves
        'read:payroll:true',
        'create:payroll:true',
        'update:payroll:true',
        'read:reports:true',
        'create:reports:true',
        'read:analytics:true',
      ],

      // Manager - Team management within department
      manager: [
        'read:employees:true',
        'update:employees:true',
        'read:departments:false', // Own department only
        'read:teams:true',
        'update:teams:true',
        'create:projects:true',
        'read:projects:true',
        'update:projects:true',
        'create:tasks:true',
        'read:tasks:true',
        'update:tasks:true',
        'delete:tasks:true',
        'read:reviews:true',
        'create:reviews:true',
        'read:attendance:true',
        'read:leaves:true',
        'update:leaves:true', // Approve team leaves
        'read:reports:true',
        'create:reports:true',
      ],

      // Team Leader - Lead specific team
      team_leader: [
        'read:employees:true',
        'update:employees:false', // Limited employee updates
        'read:teams:false', // Own team only
        'read:projects:true',
        'update:projects:false', // Own projects only
        'create:tasks:true',
        'read:tasks:true',
        'update:tasks:true',
        'delete:tasks:true',
        'read:reviews:false', // Own team reviews
        'create:reviews:false', // Create reviews for team members
        'read:attendance:true',
        'create:attendance:true',
        'read:leaves:true',
      ],

      // Sub Leader - Assistant to team leader
      sub_leader: [
        'read:employees:false', // Team members only
        'read:teams:false',
        'read:projects:false',
        'create:tasks:false',
        'read:tasks:false',
        'update:tasks:false',
        'read:attendance:true',
        'create:attendance:true',
        'read:leaves:false',
      ],

      // Project Manager - Project oversight
      project_manager: [
        'read:employees:true',
        'read:teams:true',
        'create:projects:true',
        'read:projects:true',
        'update:projects:true',
        'create:tasks:true',
        'read:tasks:true',
        'update:tasks:true',
        'delete:tasks:true',
        'read:attendance:true',
        'read:reports:true',
        'create:reports:true',
      ],

      // Product Manager - Product development
      product_manager: [
        'read:employees:true',
        'read:teams:true',
        'create:projects:true',
        'read:projects:true',
        'update:projects:true',
        'create:tasks:true',
        'read:tasks:true',
        'update:tasks:true',
        'read:reports:true',
        'create:reports:true',
      ],

      // Scrum Master - Agile facilitation
      scrum_master: [
        'read:employees:false', // Team members only
        'read:teams:false',
        'read:projects:false',
        'create:tasks:false',
        'read:tasks:false',
        'update:tasks:false',
        'read:attendance:false',
      ],

      // Technical Roles
      tech_lead: [
        'read:employees:false', // Team members only
        'read:teams:false',
        'read:projects:false',
        'update:projects:false',
        'create:tasks:false',
        'read:tasks:false',
        'update:tasks:false',
        'read:attendance:false',
        'create:attendance:false',
      ],

      system_architect: [
        'read:employees:false',
        'read:teams:false',
        'read:projects:true',
        'update:projects:false',
        'read:tasks:false',
        'read:attendance:false',
        'create:attendance:false',
      ],

      senior_developer: [
        'read:employees:false', // Team visibility
        'read:teams:false',
        'read:projects:false',
        'update:projects:false',
        'create:tasks:false',
        'read:tasks:false',
        'update:tasks:false',
        'read:attendance:false',
        'create:attendance:false',
        'read:reviews:false',
      ],

      developer: [
        'read:employees:false', // Own info only
        'update:employees:false',
        'read:teams:false',
        'read:projects:false',
        'read:tasks:false',
        'update:tasks:false',
        'read:attendance:false',
        'create:attendance:false',
        'create:leaves:false',
        'read:leaves:false',
        'update:leaves:false',
        'read:payroll:false',
        'read:notifications:false',
      ],

      junior_developer: [
        'read:employees:false',
        'update:employees:false',
        'read:teams:false',
        'read:projects:false',
        'read:tasks:false',
        'update:tasks:false',
        'read:attendance:false',
        'create:attendance:false',
        'create:leaves:false',
        'read:leaves:false',
        'read:payroll:false',
        'read:notifications:false',
      ],

      // Operations & Support
      devops_engineer: [
        'read:employees:false',
        'read:projects:true',
        'read:tasks:true',
        'read:attendance:false',
        'create:attendance:false',
        'read:settings:true',
        'update:settings:true',
      ],

      qa_lead: [
        'read:employees:false', // QA team only
        'read:teams:false',
        'read:projects:true',
        'create:tasks:true',
        'read:tasks:true',
        'update:tasks:true',
        'read:attendance:true',
        'read:reviews:false',
      ],

      qa_engineer: [
        'read:employees:false',
        'read:projects:false',
        'read:tasks:false',
        'update:tasks:false',
        'read:attendance:false',
        'create:attendance:false',
      ],

      system_admin: [
        'create:users:true',
        'read:users:true',
        'update:users:true',
        'delete:users:true',
        'create:roles:true',
        'read:roles:true',
        'update:roles:true',
        'delete:roles:true',
        'create:permissions:true',
        'read:permissions:true',
        'update:permissions:true',
        'delete:permissions:true',
        'read:settings:true',
        'update:settings:true',
        'read:audit_logs:true',
      ],

      // HR Department
      hr_manager: [
        'create:employees:true',
        'read:employees:true',
        'update:employees:true',
        'delete:employees:true',
        'read:departments:true',
        'create:reviews:true',
        'read:reviews:true',
        'update:reviews:true',
        'read:attendance:true',
        'create:attendance:true',
        'update:attendance:true',
        'read:leaves:true',
        'update:leaves:true',
        'create:payroll:true',
        'read:payroll:true',
        'update:payroll:true',
        'read:reports:true',
        'create:reports:true',
      ],

      hr_specialist: [
        'create:employees:true',
        'read:employees:true',
        'update:employees:true',
        'read:reviews:true',
        'read:attendance:true',
        'read:leaves:true',
        'update:leaves:true',
        'read:payroll:true',
      ],

      business_analyst: [
        'read:employees:true',
        'read:projects:true',
        'read:tasks:true',
        'read:reports:true',
        'create:reports:true',
        'read:analytics:true',
      ],

      // System Admin
      admin: ['manage:all:true'],

      // Basic Staff
      employee: [
        'read:employees:false',
        'update:employees:false',
        'read:departments:false',
        'read:teams:false',
        'read:projects:false',
        'read:tasks:false',
        'update:tasks:false',
        'read:attendance:false',
        'create:attendance:false',
        'create:leaves:false',
        'read:leaves:false',
        'update:leaves:false',
        'read:payroll:false',
        'read:notifications:false',
      ],

      intern: [
        'read:employees:false',
        'update:employees:false',
        'read:teams:false',
        'read:projects:false',
        'read:tasks:false',
        'read:attendance:false',
        'create:attendance:false',
        'read:notifications:false',
      ],

      contractor: [
        'read:employees:false',
        'update:employees:false',
        'read:projects:false',
        'read:tasks:false',
        'update:tasks:false',
        'read:attendance:false',
        'create:attendance:false',
        'read:notifications:false',
      ],
    };

    let totalCreated = 0;
    let totalSkipped = 0;

    // Process each role
    for (const [roleName, permissionStrings] of Object.entries(
      rolePermissionMappings,
    )) {
      console.log(`Processing role: ${roleName}`);

      // Find role
      const role = await this.roleRepository.findOne({
        where: { name: roleName },
      });

      if (!role) {
        console.log(`Role not found: ${roleName}, skipping...`);
        continue;
      }

      // Process each permission for this role
      for (const permissionString of permissionStrings) {
        const [action, resource, scopeStr] = permissionString.split(':');
        const scope = scopeStr === 'true';

        // Find permission
        const permission = await this.permissionRepository.findOne({
          where: { action, resource, scope },
        });

        if (!permission) {
          console.log(`Permission not found: ${permissionString}, skipping...`);
          continue;
        }

        // Check if role-permission mapping already exists
        const existingMapping = await this.rolePermissionRepository.findOne({
          where: {
            role: { id: role.id },
            permission: { id: permission.id },
          },
        });

        if (existingMapping) {
          console.log(
            `Role-Permission mapping already exists: ${roleName} -> ${permissionString}`,
          );
          totalSkipped++;
          continue;
        }

        // Create new role-permission mapping
        const rolePermission = this.rolePermissionRepository.create({
          role: role,
          permission: permission,
        });

        await this.rolePermissionRepository.save(rolePermission);
        console.log(`Created mapping: ${roleName} -> ${permissionString}`);
        totalCreated++;
      }
    }

    return {
      message: 'Role permissions seeding completed!',
      created: totalCreated,
      skipped: totalSkipped,
      total: totalCreated + totalSkipped,
    };
  }
  async getRolePermissions(roleName: string) {
    const role = await this.roleRepository.findOne({
      where: { name: roleName },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    if (!role) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }

    return {
      role: role.name,
      permissions: role.rolePermissions.map(rp => ({
        action: rp.permission.action,
        resource: rp.permission.resource,
        scope: rp.permission.scope,
      })),
    };
  }
}
