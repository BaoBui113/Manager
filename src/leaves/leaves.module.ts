import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leaf } from './entities/leaf.entity';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';

@Module({
  controllers: [LeavesController],
  providers: [LeavesService],
  imports: [TypeOrmModule.forFeature([Leaf])], // Add your Leaf entity here
})
export class LeavesModule {}
