import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentEntity, DocumentSchema } from './schemas/document.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentEntity.name, schema: DocumentSchema },
    ]),
  ],
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
