import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPost } from './entities/job_post.entity';
import { JobPostsController } from './job_posts.controller';
import { JobPostsService } from './job_posts.service';

@Module({
  controllers: [JobPostsController],
  providers: [JobPostsService],
  imports: [TypeOrmModule.forFeature([JobPost])], // Add your JobPost entity here
})
export class JobPostsModule {}
