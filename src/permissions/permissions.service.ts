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
}
