import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RequirePermissions } from '../shared/permission.decorator';
import { PermissionGuard } from '../shared/permission.guard';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { PayrollsService } from './payrolls.service';

@Controller('payrolls')
@UseGuards(AuthGuard, PermissionGuard)
export class PayrollsController {
  constructor(private readonly payrollsService: PayrollsService) {}

  @Post()
  @RequirePermissions({ action: 'create', resource: 'payrolls', scope: true })
  create(@Body() createPayrollDto: CreatePayrollDto, @Request() req) {
    return this.payrollsService.create(createPayrollDto, req.user.sub);
  }

  @Get()
  @RequirePermissions({ action: 'read', resource: 'payrolls', scope: true })
  findAll() {
    return this.payrollsService.findAll();
  }

  @Get(':id')
  @RequirePermissions({ action: 'read', resource: 'payrolls', scope: true })
  findOne(@Param('id') id: string) {
    return this.payrollsService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions({ action: 'update', resource: 'payrolls', scope: true })
  update(@Param('id') id: string, @Body() updatePayrollDto: UpdatePayrollDto) {
    return this.payrollsService.update(+id, updatePayrollDto);
  }

  @Delete(':id')
  @RequirePermissions({ action: 'delete', resource: 'payrolls', scope: true })
  remove(@Param('id') id: string) {
    return this.payrollsService.remove(+id);
  }

  @Get('queue/stats')
  @RequirePermissions({ action: 'read', resource: 'payrolls', scope: true })
  getQueueStats() {
    return this.payrollsService.getQueueStats();
  }
}
