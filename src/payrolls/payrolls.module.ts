import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { User } from '../entities/user.entity';
import { PermissionGuard } from '../shared/permission.guard';
import { Payroll } from './entities/payroll.entity';
import { PayrollProcessor } from './payroll.processor';
import { PayrollsController } from './payrolls.controller';
import { PayrollsService } from './payrolls.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payroll, Employee, User]),
    BullModule.registerQueue({
      name: 'payroll',
    }),
  ],
  controllers: [PayrollsController],
  providers: [PayrollsService, PayrollProcessor, PermissionGuard],
  exports: [PayrollsService],
})
export class PayrollsModule {}
