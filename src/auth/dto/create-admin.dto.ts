import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
