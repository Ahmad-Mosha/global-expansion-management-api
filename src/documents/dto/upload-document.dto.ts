import { IsString, IsArray, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentDto {
  @ApiProperty({ example: 'Market Research Report' })
  @IsString()
  title: string;

  @ApiProperty({
    example:
      'Analysis of European market trends for Q3 2024, showing 15% growth in tech sector. Includes competitor analysis and expansion recommendations for Germany and France.',
  })
  @IsString()
  content: string;

  @ApiProperty({ example: 'uuid-project-id' })
  @IsUUID()
  projectId: string;

  @ApiProperty({ example: ['market', 'research', 'analysis'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
