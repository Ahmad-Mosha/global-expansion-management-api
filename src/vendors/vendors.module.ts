import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { Vendor } from './entity/vendor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor])],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule {}
