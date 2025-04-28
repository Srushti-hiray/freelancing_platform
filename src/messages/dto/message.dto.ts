import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  projectId: number;

  @IsNumber()
  receiverId: number;

  @IsString()
  content: string;
}