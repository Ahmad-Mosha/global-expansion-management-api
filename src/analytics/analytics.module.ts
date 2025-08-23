import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Match } from '../matches/entity/match.entity';
import { Vendor } from '../vendors/entity/vendor.entity';
import { Project } from '../projects/entity/project.entity';
import {
  DocumentEntity,
  DocumentSchema,
} from '../documents/schemas/document.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Vendor, Project]),
    MongooseModule.forFeature([
      { name: DocumentEntity.name, schema: DocumentSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
