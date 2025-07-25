import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from './entities/user_role.entity';
import { UserRolesController } from './user_roles.controller';
import { UserRolesService } from './user_roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole, User, Role])],
  controllers: [UserRolesController],
  providers: [UserRolesService],
  exports: [UserRolesService], // Export service để các module khác có thể sử dụng
})
export class UserRolesModule {}
