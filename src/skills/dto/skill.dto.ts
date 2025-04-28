import { IsString, Length } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @Length(1, 255)
  name: string;
}