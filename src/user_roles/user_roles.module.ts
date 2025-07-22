import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './entities/user_role.entity';
import { UserRolesController } from './user_roles.controller';
import { UserRolesService } from './user_roles.service';

@Module({
  controllers: [UserRolesController],
  providers: [UserRolesService],
  imports: [TypeOrmModule.forFeature([UserRole])], // Add your UserRole entity here
})
export class UserRolesModule {}
