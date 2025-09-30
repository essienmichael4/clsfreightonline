import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { JwtGuard } from 'src/guards/jwt.guard';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { Status } from './entities/invoice.entity';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto, @User() user:UserInfo) {
    return this.invoiceService.create(createInvoiceDto, user.sub.id);
  }

  @Get("admin")
  findAll(@Query() pageOptionsDto:PageOptionsDto, @Query("search") search?: string,@Query("status") status?:Status) {
    return this.invoiceService.findAllInvoiceForAdmin(pageOptionsDto, search, status);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(+id);
  }
}
