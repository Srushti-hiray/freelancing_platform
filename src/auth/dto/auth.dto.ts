import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(['client', 'freelancer'])
  role: 'client' | 'freelancer';
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}