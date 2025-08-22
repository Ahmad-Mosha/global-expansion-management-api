import {
  Controller,
  Post,
  Get,
  Query,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { SearchDocumentDto } from './dto/search-document.dto';
import * as fs from 'fs';
import { JwtAuthGuard } from 'src/auth';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: { type: 'string' },
        content: {
          type: 'string',
          description: 'Summary or description of the document content',
        },
        projectId: { type: 'string' },
        tags: {
          type: 'string',
          description:
            'Comma-separated tags (e.g., "market,research,analysis")',
        },
      },
      required: ['file', 'title', 'content', 'projectId'],
    },
  })
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    // Parse form data - tags come as comma-separated string in form data
    const uploadDto: UploadDocumentDto = {
      title: body.title,
      content: body.content,
      projectId: body.projectId,
      tags: body.tags
        ? body.tags.split(',').map((tag: string) => tag.trim())
        : [],
    };

    return this.documentsService.uploadDocument(uploadDto, file);
  }

  @Get('search')
  async searchDocuments(@Query() searchDto: SearchDocumentDto) {
    return this.documentsService.searchDocuments(searchDto);
  }

  @Get(':id/download')
  async downloadDocument(@Param('id') id: string, @Res() res: Response) {
    const { filePath, fileName, mimeType } =
      await this.documentsService.getDocumentFile(id);

    const fileStream = fs.createReadStream(filePath);
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    fileStream.pipe(res);
  }
}
