import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './entities/delivery.entity';
import { JwtService } from '@nestjs/jwt';
import { Client } from 'src/user/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery, Client])],
  controllers: [DeliveryController],
  providers: [DeliveryService, JwtService],
})
export class DeliveryModule {}
