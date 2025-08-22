import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({ example: 'Global Tech Solutions' })
  @IsString()
  name: string;

  @ApiProperty({ example: ['USA', 'Canada', 'UK'] })
  @IsArray()
  @IsString({ each: true })
  countries_supported: string[];

  @ApiProperty({
    example: ['Software Development', 'Cloud Services', 'Consulting'],
  })
  @IsArray()
  @IsString({ each: true })
  services_offered: string[];

  @ApiProperty({ example: 4.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiProperty({ example: 24, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  response_sla_hours?: number;
}
