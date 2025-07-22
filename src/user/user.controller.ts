import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';

// User Controller - Quản lý các API liên quan đến user
@Controller('users')
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
}
