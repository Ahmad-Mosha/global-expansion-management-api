import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { Match } from './entity/match.entity';
import { Project } from '../projects/entity/project.entity';
import { Vendor } from '../vendors/entity/vendor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Project, Vendor])],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
