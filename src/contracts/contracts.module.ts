import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { Contract } from './entities/contract.entity';

@Module({
  controllers: [ContractsController],
  providers: [ContractsService],
  imports: [TypeOrmModule.forFeature([Contract])], // Add your Contract entity here
})
export class ContractsModule {}
