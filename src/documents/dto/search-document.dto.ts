import { IsString, IsArray, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDocumentDto {
  @ApiProperty({ example: 'uuid-project-id', required: false })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiProperty({ example: 'market research', required: false })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({ example: ['market', 'research'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: 'USA', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'market-report', required: false })
  @IsOptional()
  @IsString()
  documentType?: string;
}
