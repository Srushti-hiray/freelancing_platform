import { IsString, IsNumber, IsBoolean,IsOptional, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateProjectDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  budget: number;

  @IsDateString()
  deadline: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsNumber()
  freelancerId?: number;
}

export class FilterProjectsDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minBudget?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxBudget?: number;

  @IsOptional()
  @IsDateString()
  minDeadline?: string;

  @IsOptional()
  @IsBoolean()
  activeOnly?: boolean; // Only show projects without a freelancer

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  freelancerId?: number; // Filter by freelancer ID

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  clientId?: number; // Filter by client ID

  @IsOptional()
  @IsString()
  search?: string; // For title/description search
}