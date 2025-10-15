import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { Confirmation, PickupReady, Status } from './entities/delivery.entity';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createDeliveryDto: CreateDeliveryDto, @User() user:UserInfo) {
    return this.deliveryService.create(createDeliveryDto, user.sub.id);
  }

   // ✅ GET /deliveries?includeClient=true
   @UseGuards(JwtGuard)
  @Get()
  findAll(@Query() pageOptionsDto:PageOptionsDto, @Query('includeClient') includeClient?: string) {
    return this.deliveryService.findAll(pageOptionsDto, includeClient === 'true');
  }

  @Get("all")
  exportDeliveries() {
    return this.deliveryService.export();
  }

  // ✅ GET /deliveries/client/5
  @UseGuards(JwtGuard)
  @Get('client')
  findAllClientDeliveries(@Query() pageOptionsDto:PageOptionsDto, @User() user:UserInfo) {
    return this.deliveryService.findAllClientDeliveries(pageOptionsDto, user.sub.id);
  }

  // ✅ GET /deliveries/client/5
  @UseGuards(JwtGuard)
  @Get(':id/client')
  findClientSingleDelivery(@Param('id', ParseIntPipe) id: number, @User() user:UserInfo) {
    return this.deliveryService.findClientSingleDelivery(id, user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.deliveryService.findOne(id);
  }

  // ✅ PATCH /deliveries/:id
  @UseGuards(JwtGuard)
  @Patch(':id')
  updateDelivery(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateDeliveryDto) {
    return this.deliveryService.update(id, updateDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/status')
  async updateStatus( @Param('id', ParseIntPipe) id: number, @Body('status') status: Status ) {
    return this.deliveryService.editStatus(id, status);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/confirmation')
  async updateConfirmation(@Param('id', ParseIntPipe) id: number, @Body('confirmation') confirmation: Confirmation, ) {
    return this.deliveryService.editConfirmation(id, confirmation);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/pickup-ready')
  async updateReadyForPickup(@Param('id', ParseIntPipe) id: number, @Body('pickup') isPickupReady: PickupReady, ) {
    return this.deliveryService.editReadyForPickup(id, isPickupReady);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deliveryService.remove(id);
  }
}
