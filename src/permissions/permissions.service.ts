import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    // Check if permission with same action and resource already exists
    const existingPermission = await this.permissionRepository.findOne({
      where: {
        action: createPermissionDto.action,
        resource: createPermissionDto.resource,
      },
    });

    if (existingPermission) {
      throw new BadRequestException(
        `Permission with action '${createPermissionDto.action}' on resource '${createPermissionDto.resource}' already exists`,
      );
    }

    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return await this.permissionRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);

    // If updating action or resource, check for duplicates
    if (updatePermissionDto.action || updatePermissionDto.resource) {
      const action = updatePermissionDto.action || permission.action;
      const resource = updatePermissionDto.resource || permission.resource;

      const existingPermission = await this.permissionRepository.findOne({
        where: {
          action,
          resource,
        },
      });

      if (existingPermission && existingPermission.id !== id) {
        throw new BadRequestException(
          `Permission with action '${action}' on resource '${resource}' already exists`,
        );
      }
    }

    Object.assign(permission, updatePermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async remove(id: number): Promise<{ message: string }> {
    const permission = await this.findOne(id);
    await this.permissionRepository.remove(permission);
    return { message: `Permission has been removed successfully` };
  }

  async seedPermissions() {
    const permissions = [
      // Employee Management
      { action: 'create', resource: 'employees', scope: true }, // Tạo nhân viên mới
      { action: 'read', resource: 'employees', scope: true }, // Xem tất cả nhân viên
      { action: 'read', resource: 'employees', scope: false }, // Chỉ xem thông tin của mình
      { action: 'update', resource: 'employees', scope: true }, // Sửa thông tin nhân viên
      { action: 'update', resource: 'employees', scope: false }, // Chỉ sửa thông tin của mình
      { action: 'delete', resource: 'employees', scope: true }, // Xóa nhân viên

      // Department Management
      { action: 'create', resource: 'departments', scope: true },
      { action: 'read', resource: 'departments', scope: true },
      { action: 'update', resource: 'departments', scope: true },
      { action: 'delete', resource: 'departments', scope: true },
      { action: 'read', resource: 'departments', scope: false }, // Chỉ xem phòng ban của mình

      // Team Management
      { action: 'create', resource: 'teams', scope: true },
      { action: 'read', resource: 'teams', scope: true },
      { action: 'update', resource: 'teams', scope: true },
      { action: 'delete', resource: 'teams', scope: true },
      { action: 'read', resource: 'teams', scope: false }, // Chỉ xem team của mình

      // Project Management
      { action: 'create', resource: 'projects', scope: true },
      { action: 'read', resource: 'projects', scope: true },
      { action: 'update', resource: 'projects', scope: true },
      { action: 'delete', resource: 'projects', scope: true },
      { action: 'read', resource: 'projects', scope: false }, // Chỉ xem project được assign
      { action: 'update', resource: 'projects', scope: false }, // Chỉ sửa project được assign

      // Task Management
      { action: 'create', resource: 'tasks', scope: true },
      { action: 'read', resource: 'tasks', scope: true },
      { action: 'update', resource: 'tasks', scope: true },
      { action: 'delete', resource: 'tasks', scope: true },
      { action: 'read', resource: 'tasks', scope: false }, // Chỉ xem task của mình
      { action: 'update', resource: 'tasks', scope: false }, // Chỉ sửa task của mình

      // Performance & Reviews
      { action: 'create', resource: 'reviews', scope: true },
      { action: 'read', resource: 'reviews', scope: true },
      { action: 'update', resource: 'reviews', scope: true },
      { action: 'delete', resource: 'reviews', scope: true },
      { action: 'read', resource: 'reviews', scope: false }, // Chỉ xem review của mình

      // Attendance & Time Tracking
      { action: 'create', resource: 'attendance', scope: true },
      { action: 'read', resource: 'attendance', scope: true },
      { action: 'update', resource: 'attendance', scope: true },
      { action: 'delete', resource: 'attendance', scope: true },
      { action: 'create', resource: 'attendance', scope: false }, // Check-in/out của mình
      { action: 'read', resource: 'attendance', scope: false }, // Xem attendance của mình

      // Leave Management
      { action: 'create', resource: 'leaves', scope: true },
      { action: 'read', resource: 'leaves', scope: true },
      { action: 'update', resource: 'leaves', scope: true }, // Approve/reject leave
      { action: 'delete', resource: 'leaves', scope: true },
      { action: 'create', resource: 'leaves', scope: false }, // Tạo leave request của mình
      { action: 'read', resource: 'leaves', scope: false }, // Xem leave của mình
      { action: 'update', resource: 'leaves', scope: false }, // Sửa leave request của mình

      // Payroll & Salary
      { action: 'create', resource: 'payroll', scope: true },
      { action: 'read', resource: 'payroll', scope: true },
      { action: 'update', resource: 'payroll', scope: true },
      { action: 'delete', resource: 'payroll', scope: true },
      { action: 'read', resource: 'payroll', scope: false }, // Xem lương của mình

      // Reports & Analytics
      { action: 'read', resource: 'reports', scope: true }, // Xem tất cả reports
      { action: 'create', resource: 'reports', scope: true }, // Tạo reports
      { action: 'read', resource: 'analytics', scope: true }, // Xem analytics dashboard

      // System Management
      { action: 'create', resource: 'users', scope: true },
      { action: 'read', resource: 'users', scope: true },
      { action: 'update', resource: 'users', scope: true },
      { action: 'delete', resource: 'users', scope: true },
      { action: 'read', resource: 'users', scope: false },

      // Role & Permission Management
      { action: 'create', resource: 'roles', scope: true },
      { action: 'read', resource: 'roles', scope: true },
      { action: 'update', resource: 'roles', scope: true },
      { action: 'delete', resource: 'roles', scope: true },

      { action: 'create', resource: 'permissions', scope: true },
      { action: 'read', resource: 'permissions', scope: true },
      { action: 'update', resource: 'permissions', scope: true },
      { action: 'delete', resource: 'permissions', scope: true },

      // Notifications
      { action: 'create', resource: 'notifications', scope: true },
      { action: 'read', resource: 'notifications', scope: true },
      { action: 'update', resource: 'notifications', scope: true },
      { action: 'delete', resource: 'notifications', scope: true },
      { action: 'read', resource: 'notifications', scope: false }, // Đọc thông báo của mình

      // Audit Logs
      { action: 'read', resource: 'audit_logs', scope: true },

      // System Settings
      { action: 'read', resource: 'settings', scope: true },
      { action: 'update', resource: 'settings', scope: true },

      // Super Admin Permission
      { action: 'manage', resource: 'all', scope: true },
    ];

    const createdPermissions: Permission[] = [];

    for (const permissionData of permissions) {
      const existingPermission = await this.permissionRepository.findOne({
        where: {
          action: permissionData.action,
          resource: permissionData.resource,
          scope: permissionData.scope,
        },
      });

      if (!existingPermission) {
        const permission = this.permissionRepository.create(permissionData);
        const savedPermission =
          await this.permissionRepository.save(permission);
        createdPermissions.push(savedPermission);
        console.log(
          `Created permission: ${permissionData.action}:${permissionData.resource}:${permissionData.scope}`,
        );
      }
    }

    return {
      message: 'Employee management permissions seeding completed!',
      created: createdPermissions.length,
      total: permissions.length,
      permissions: createdPermissions,
    };
  }
}
