import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { Match } from './entity/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
