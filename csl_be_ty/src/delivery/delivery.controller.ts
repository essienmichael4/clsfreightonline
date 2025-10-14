import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { Confirmation, Status } from './entities/delivery.entity';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createDeliveryDto: CreateDeliveryDto, @User() user:UserInfo) {
    return this.deliveryService.create(createDeliveryDto, user.sub.id);
  }

   // ✅ GET /deliveries?includeClient=true
  @Get()
  findAll(@Query('includeClient') includeClient?: string) {
    return this.deliveryService.findAll(includeClient === 'true');
  }

  // ✅ GET /deliveries/client/5
  @Get('client/:id')
  findAllClientDeliveries(@Param('id', ParseIntPipe) clientId: number) {
    return this.deliveryService.findAllClientDeliveries(clientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(+id);
  }

  // ✅ PATCH /deliveries/:id
  @Patch(':id')
  updateDelivery(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateDeliveryDto) {
    return this.deliveryService.update(id, updateDto);
  }

  @Patch(':id/status')
  async updateStatus( @Param('id', ParseIntPipe) id: number, @Body('status') status: Status ) {
    return this.deliveryService.editStatus(id, status);
  }

  @Patch(':id/confirmation')
  async updateConfirmation(@Param('id', ParseIntPipe) id: number, @Body('confirmation') confirmation: Confirmation, ) {
    return this.deliveryService.editConfirmation(id, confirmation);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(+id);
  }
}
