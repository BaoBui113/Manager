import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendancesController } from './attendances.controller';
import { AttendancesService } from './attendances.service';
import { Attendance } from './entities/attendance.entity';

@Module({
  controllers: [AttendancesController],
  providers: [AttendancesService],
  imports: [TypeOrmModule.forFeature([Attendance])],
})
export class AttendancesModule {}
