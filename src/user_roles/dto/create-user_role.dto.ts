import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserRoleDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @IsOptional()
  @IsString()
  scope?: string = 'all';
}
