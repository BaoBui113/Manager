import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Public } from '../auth/constants';
import { User } from '../entities/user.entity';
import { RequirePermissions } from '../shared/permission.decorator';
import { PermissionGuard } from '../shared/permission.guard';
import { CreateEmployeeWithUserDto } from './user.dto';
import { UserService } from './user.service';

// User Controller - Quản lý các API liên quan đến user
@Controller('users')
@UseGuards(AuthGuard, PermissionGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.create(userData);
  }

  @Public()
  @Post('seed')
  seedUsers() {
    return this.userService.seedUsers();
  }

  @Post('employee')
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions({ action: 'create', resource: 'employees', scope: true })
  async createEmployeeWithUser(@Body() createData: CreateEmployeeWithUserDto) {
    return this.userService.createEmployeeWithUser(createData);
  }
}
