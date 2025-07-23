import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { EmployeesService } from '../employees/employees.service';
import { UserService } from '../user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private readonly employeeService: EmployeesService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(userData: CreateAuthDto) {
    if (!userData.email) {
      throw new UnauthorizedException('Email is required');
    }
    const existingUser = await this.usersService.findByEmail(userData.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }
    await this.employeeService.create({
      full_name: userData.full_name,
      phone: userData.phone,
      gender: userData.gender,
      address: userData.address,
      joined_date: new Date(),
    });
    const user = await this.usersService.create({
      password: userData.password,
      email: userData.email,
    });
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
