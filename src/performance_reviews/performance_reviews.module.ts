import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceReview } from './entities/performance_review.entity';
import { PerformanceReviewsController } from './performance_reviews.controller';
import { PerformanceReviewsService } from './performance_reviews.service';

@Module({
  controllers: [PerformanceReviewsController],
  providers: [PerformanceReviewsService],
  imports: [TypeOrmModule.forFeature([PerformanceReview])], // Add your entities here
})
export class PerformanceReviewsModule {}
