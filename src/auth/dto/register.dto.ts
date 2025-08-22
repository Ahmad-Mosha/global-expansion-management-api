import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'client@company.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password (minimum 6 characters)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Acme Corporation',
    description: 'Company name for client registration',
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({
    example: 'inv_token_123',
    description: 'Invitation token (if applicable)',
    required: false,
  })
  @IsOptional()
  @IsString()
  invitationToken?: string;
}
