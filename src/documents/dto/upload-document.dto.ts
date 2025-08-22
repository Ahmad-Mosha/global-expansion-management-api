import { IsString, IsArray, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentDto {
  @ApiProperty({ example: 'Market Research Report' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'uuid-project-id' })
  @IsUUID()
  projectId: string;

  @ApiProperty({ example: ['market', 'research', 'analysis'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: 'USA' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'market-report' })
  @IsOptional()
  @IsString()
  documentType?: string;
}
