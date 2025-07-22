import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from './entities/role_permission.entity';
import { RolePermissionsController } from './role_permissions.controller';
import { RolePermissionsService } from './role_permissions.service';

@Module({
  controllers: [RolePermissionsController],
  providers: [RolePermissionsService],
  imports: [TypeOrmModule.forFeature([RolePermission])], // Add your RolePermission entity here
})
export class RolePermissionsModule {}
