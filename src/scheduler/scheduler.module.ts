import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { Project } from '../projects/entity/project.entity';
import { Vendor } from '../vendors/entity/vendor.entity';
import { Match } from '../matches/entity/match.entity';
import { MatchesModule } from '../matches/matches.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Vendor, Match]),
    ConfigModule,
    MatchesModule,
    NotificationsModule,
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
