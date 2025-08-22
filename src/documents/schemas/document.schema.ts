import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class DocumentEntity extends Document {
  @Prop({ required: true })
  projectId: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  tags: string[];

  @Prop()
  fileName: string;

  @Prop()
  fileSize: number;

  @Prop()
  mimeType: string;

  @Prop({
    type: Object,
    default: {},
  })
  metadata: {
    country?: string;
    documentType?: string;
    [key: string]: any;
  };
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentEntity);
