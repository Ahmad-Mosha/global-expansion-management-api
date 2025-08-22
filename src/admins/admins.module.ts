import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { Admin } from './entity/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
