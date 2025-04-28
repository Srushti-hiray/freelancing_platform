import { IsNumber, IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';

export class CreateMilestoneDto {
  @IsNumber()
  projectId: number;

  @IsString()
  title: string;

  @IsDateString()
  dueDate: string;

  @IsNumber()
  amount: number;
}

export class UpdateMilestoneDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsEnum(['pending', 'completed', 'paid'])
  status?: 'pending' | 'completed' | 'paid';
}