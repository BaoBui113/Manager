import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogsController } from './audit_logs.controller';
import { AuditLogsService } from './audit_logs.service';
import { AuditLog } from './entities/audit_log.entity';

@Module({
  controllers: [AuditLogsController],
  providers: [AuditLogsService],
  imports: [TypeOrmModule.forFeature([AuditLog])], // Add your AuditLog entity here
})
export class AuditLogsModule {}
