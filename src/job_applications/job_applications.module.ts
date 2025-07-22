import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from './entities/job_application.entity';
import { JobApplicationsController } from './job_applications.controller';
import { JobApplicationsService } from './job_applications.service';

@Module({
  controllers: [JobApplicationsController],
  providers: [JobApplicationsService],
  imports: [TypeOrmModule.forFeature([JobApplication])], // Add your JobApplication entity here
})
export class JobApplicationsModule {}
