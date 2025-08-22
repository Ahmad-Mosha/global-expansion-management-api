import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentEntity } from './schemas/document.schema';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { SearchDocumentDto } from './dto/search-document.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentEntity.name)
    private documentModel: Model<DocumentEntity>,
  ) {}

  async uploadDocument(
    uploadDto: UploadDocumentDto,
    file: Express.Multer.File,
  ): Promise<DocumentEntity> {
    // Create directory if it doesn't exist
    const uploadDir = path.join('uploads', 'documents', uploadDto.projectId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file to disk
    const filePath = path.join(uploadDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    // Create document record with user-provided content summary
    const document = new this.documentModel({
      projectId: uploadDto.projectId,
      title: uploadDto.title,
      content: uploadDto.content, // User-provided summary/description
      tags: uploadDto.tags || [],
      fileName: file.originalname,
      filePath,
      fileSize: file.size,
      mimeType: file.mimetype,
    });

    return document.save();
  }

  async searchDocuments(
    searchDto: SearchDocumentDto,
  ): Promise<DocumentEntity[]> {
    const query: any = {};

    if (searchDto.projectId) {
      query.projectId = searchDto.projectId;
    }

    if (searchDto.text) {
      query.$or = [
        { title: { $regex: searchDto.text, $options: 'i' } },
        { content: { $regex: searchDto.text, $options: 'i' } },
      ];
    }

    if (searchDto.tags && searchDto.tags.trim().length > 0) {
      const tagsArray = searchDto.tags.split(',').map((tag) => tag.trim());
      query.tags = { $in: tagsArray };
    }

    return this.documentModel.find(query).exec();
  }

  async getDocumentById(id: string): Promise<DocumentEntity> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async getDocumentFile(
    id: string,
  ): Promise<{ filePath: string; fileName: string; mimeType: string }> {
    const document = await this.getDocumentById(id);

    if (!fs.existsSync(document.filePath)) {
      throw new NotFoundException('File not found on disk');
    }

    return {
      filePath: document.filePath,
      fileName: document.fileName,
      mimeType: document.mimeType,
    };
  }
}
