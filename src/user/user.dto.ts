import { IsArray, IsString } from 'class-validator';

export class CreateEmployeeWithUserDto {
  @IsString()
  email: string;
  @IsString()
  password: string;

  // Employee data
  @IsString()
  full_name: string;
  @IsString()
  phone: string;
  @IsString()
  gender: string;
  @IsString()
  address: string;
  @IsString()
  dob: string | Date;
  @IsString()
  joined_date?: Date;
  @IsArray()
  roles: string[];
}
