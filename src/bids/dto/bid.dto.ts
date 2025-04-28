import { IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateBidDto {
  @IsNumber()
  projectId: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  amount: number;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  duration: number;

  @IsString()
  message: string;
}