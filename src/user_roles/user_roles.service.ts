import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateUserRoleDto } from './dto/create-user_role.dto';
import { UpdateUserRoleDto } from './dto/update-user_role.dto';
import { UserRole } from './entities/user_role.entity';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id: createUserRoleDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createUserRoleDto.userId} not found`,
      );
    }

    // Check if role exists
    const role = await this.roleRepository.findOne({
      where: { id: createUserRoleDto.roleId },
    });
    if (!role) {
      throw new NotFoundException(
        `Role with ID ${createUserRoleDto.roleId} not found`,
      );
    }

    // Check if user already has this role
    const existingUserRole = await this.userRoleRepository.findOne({
      where: {
        user: { id: createUserRoleDto.userId },
        role: { id: createUserRoleDto.roleId },
      },
      select: {
        user: { id: true, email: true },
        role: { id: true, name: true },
      },
    });
    if (existingUserRole) {
      throw new BadRequestException('User already has this role assigned');
    }

    const userRole = this.userRoleRepository.create({
      user: user,
      role: role,
      scope: createUserRoleDto.scope || 'all',
    });

    return await this.userRoleRepository.save(userRole);
  }

  async findAll(): Promise<UserRole[]> {
    return await this.userRoleRepository.find({
      relations: ['user', 'role'],
      select: {
        user: {
          id: true,
          email: true,
        },
        role: {
          id: true,
          name: true,
        },
      },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<UserRole> {
    const userRole = await this.userRoleRepository.findOne({
      where: { id },
      relations: ['user', 'role'],
    });

    if (!userRole) {
      throw new NotFoundException(`UserRole with ID ${id} not found`);
    }

    return userRole;
  }

  async update(
    id: number,
    updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<UserRole> {
    const userRole = await this.findOne(id);

    // If updating user or role, check if they exist
    if (updateUserRoleDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: updateUserRoleDto.userId },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateUserRoleDto.userId} not found`,
        );
      }
      userRole.user = user;
    }

    if (updateUserRoleDto.roleId) {
      const role = await this.roleRepository.findOne({
        where: { id: updateUserRoleDto.roleId },
      });
      if (!role) {
        throw new NotFoundException(
          `Role with ID ${updateUserRoleDto.roleId} not found`,
        );
      }
      userRole.role = role;
    }

    if (updateUserRoleDto.scope !== undefined) {
      userRole.scope = updateUserRoleDto.scope;
    }

    return await this.userRoleRepository.save(userRole);
  }

  async remove(id: number): Promise<{ message: string }> {
    const userRole = await this.findOne(id);
    await this.userRoleRepository.remove(userRole);
    return { message: `UserRole assignment has been removed successfully` };
  }
}
