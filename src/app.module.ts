import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendancesModule } from './attendances/attendances.module';
import { AuditLogsModule } from './audit_logs/audit_logs.module';
import { AuthModule } from './auth/auth.module';
import { ContractsModule } from './contracts/contracts.module';
import { DepartmentsModule } from './departments/departments.module';
import { EmployeesModule } from './employees/employees.module';
import { JobApplicationsModule } from './job_applications/job_applications.module';
import { JobPostsModule } from './job_posts/job_posts.module';
import { LeavesModule } from './leaves/leaves.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PayrollsModule } from './payrolls/payrolls.module';
import { PerformanceReviewsModule } from './performance_reviews/performance_reviews.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PositionsModule } from './positions/positions.module';
import { RolePermissionsModule } from './role_permissions/role_permissions.module';
import { RolesModule } from './roles/roles.module';
import { TeamMembersModule } from './team_members/team_members.module';
import { TeamsModule } from './teams/teams.module';
import { UserModule } from './user/user.module';
import { UserRolesModule } from './user_roles/user_roles.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging:
          configService.get('NODE_ENV') === 'development'
            ? ['query', 'error', 'schema']
            : false,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    EmployeesModule,
    DepartmentsModule,
    PositionsModule,
    TeamsModule,
    TeamMembersModule,
    RolesModule,
    PermissionsModule,
    RolePermissionsModule,
    UserRolesModule,
    ContractsModule,
    LeavesModule,
    AttendancesModule,
    PayrollsModule,
    PerformanceReviewsModule,
    JobPostsModule,
    JobApplicationsModule,
    AuditLogsModule,
    NotificationsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
