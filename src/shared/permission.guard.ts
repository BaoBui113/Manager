import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export interface RequiredPermission {
  action: string;
  resource: string;
  scope?: boolean;
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Lấy permissions yêu cầu từ decorator
    const requiredPermissions = this.reflector.get<RequiredPermission[]>(
      'permissions',
      context.getHandler(),
    );

    // Nếu không có permission yêu cầu -> cho phép truy cập
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Lấy thông tin user đầy đủ từ database
    const fullUser = await this.userRepository.findOne({
      where: { id: user.sub },
      relations: [
        'userRoles',
        'userRoles.role',
        'userRoles.role.rolePermissions',
        'userRoles.role.rolePermissions.permission',
      ],
    });

    if (!fullUser) {
      throw new UnauthorizedException('User not found');
    }

    // Thêm user vào request để sử dụng sau này
    request.currentUser = fullUser;

    // Kiểm tra quyền
    const hasPermission = this.hasRequiredPermissions(
      fullUser,
      requiredPermissions,
    );

    if (!hasPermission) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }

  private hasRequiredPermissions(
    user: User,
    requiredPermissions: RequiredPermission[],
  ): boolean {
    // Admin và CEO có tất cả quyền
    const isAdmin = user.userRoles?.some(
      ur => ur.role.name === 'admin' || ur.role.name === 'ceo',
    );

    if (isAdmin) {
      return true;
    }

    // Lấy tất cả permissions của user
    const userPermissions =
      user.userRoles?.flatMap(
        userRole =>
          userRole.role.rolePermissions?.map(rp => rp.permission) || [],
      ) || [];

    // Kiểm tra từng permission required (chỉ cần 1 cái match là đủ)
    return requiredPermissions.some(required => {
      return userPermissions.some(
        permission =>
          permission.action === required.action &&
          permission.resource === required.resource &&
          (required.scope === undefined || permission.scope === required.scope),
      );
    });
  }
}
