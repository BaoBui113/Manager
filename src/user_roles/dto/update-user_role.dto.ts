import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateUserRoleDto } from './create-user_role.dto';

export class UpdateUserRoleDto extends PartialType(CreateUserRoleDto) {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsString()
  scope?: string;
}
