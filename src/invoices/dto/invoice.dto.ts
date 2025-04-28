import { IsNumber, IsEnum, IsOptional } from 'class-validator';

export class CreateInvoiceDto {
  @IsNumber()
  milestoneId: number;

  @IsNumber()
  amount: number;
}

export class UpdateInvoiceDto {
  @IsOptional()
  @IsEnum(['pending', 'paid'])
  status?: 'pending' | 'paid';
}