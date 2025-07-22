import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  imports: [TypeOrmModule.forFeature([Department])], // Add your Department entity here
})
export class DepartmentsModule {}
