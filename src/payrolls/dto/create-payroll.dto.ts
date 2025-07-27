import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreatePayrollDto {
  @IsNumber()
  employee_id: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  @Min(2020)
  year: number;

  @IsOptional()
  @IsNumber()
  base_salary?: number;

  @IsOptional()
  @IsNumber()
  bonus?: number;

  @IsOptional()
  @IsNumber()
  deduction?: number;
}
