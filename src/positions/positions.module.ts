import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService],
  imports: [TypeOrmModule.forFeature([Position])], // Ensure you import the Position entity
})
export class PositionsModule {}
