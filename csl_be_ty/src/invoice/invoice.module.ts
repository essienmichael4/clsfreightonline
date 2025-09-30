import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Client } from 'src/user/entities/client.entity';
import { Package } from 'src/package/entities/package.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Client, Package, User])],
  controllers: [InvoiceController],
  providers: [InvoiceService, JwtService],
})
export class InvoiceModule {}
