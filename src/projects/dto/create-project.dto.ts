import {
  IsString,
  IsArray,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '../entity/project.entity';

export class CreateProjectDto {
  @ApiProperty({ example: 'USA' })
  @IsString()
  country: string;

  @ApiProperty({
    example: ['Software Development', 'Cloud Services', 'Consulting'],
  })
  @IsArray()
  @IsString({ each: true })
  services_needed: string[];

  @ApiProperty({ example: 50000.0 })
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiProperty({
    example: ProjectStatus.ACTIVE,
    enum: ProjectStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
