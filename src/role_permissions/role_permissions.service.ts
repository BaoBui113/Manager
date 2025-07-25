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
}
