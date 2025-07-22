import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService],
  imports: [TypeOrmModule.forFeature([Permission])], // Add your Permission entity here
})
export class PermissionsModule {}
