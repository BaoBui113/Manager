import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payroll } from './entities/payroll.entity';
import { PayrollsController } from './payrolls.controller';
import { PayrollsService } from './payrolls.service';

@Module({
  controllers: [PayrollsController],
  providers: [PayrollsService],
  imports: [TypeOrmModule.forFeature([Payroll])],
})
export class PayrollsModule {}
