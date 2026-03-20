import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceAddress } from './entities/address.entity';
import { Warehouse } from './entities/warehouse.entity';
import { Helpline } from './entities/helpline.entity';
import { JwtService } from '@nestjs/jwt';
import { Bank } from './entities/bank.entity';
import { Marque } from './entities/marque.entity';
import { UserModule } from 'src/user/user.module';
import { Rate } from './entities/rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceAddress, Warehouse, Helpline, Bank, Marque, Rate]), UserModule],
  controllers: [SettingsController],
  providers: [SettingsService, JwtService],
})
export class SettingsModule {}
