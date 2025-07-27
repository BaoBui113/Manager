import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { User } from '../entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { PermissionGuard } from '../shared/permission.guard';
import { UserRole } from '../user_roles/entities/user_role.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Employee, Role, UserRole])],
  controllers: [UserController],
  providers: [UserService, PermissionGuard],
  exports: [UserService],
})
export class UserModule {}
