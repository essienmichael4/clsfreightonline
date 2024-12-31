import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { EditPackageRequest, PackageRequest } from './dto/package.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { Status } from './entities/package.entity';

interface StatusRequest{
  status:Status
}
interface LoadedRequest{
  loaded:string
}
interface ReceivedRequest{
  received:string
}
interface EtaRequest{
  eta:string
}

@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() body: PackageRequest, @User() user:UserInfo) {
    return this.packageService.create({
      customer: body.customer, 
      trackingNumber: body.trackingNumber,
      cbm: body.cbm,
      quantity: body.quantity,
      package: body.package,
      email: body.email,
      phone: body.phone,
      vessel: body.vessel,
      status: body.status,
      addedBy: user.sub.id,
      loaded: body.loaded,
      eta: body.eta,
      received: body.received
    });
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.packageService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.packageService.findOneById(+id);
  }

  @UseGuards(JwtGuard)
  @Get(':trackingNumber')
  findWithTrackingNumber(@Param('trackingNumber') trackingNumber: string) {
    return this.packageService.findOneByTrackingNumber(trackingNumber);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() editPackageRequest: EditPackageRequest) {
    return this.packageService.update(id, editPackageRequest.trackingNumber, editPackageRequest.customer, editPackageRequest.email, editPackageRequest.phone, editPackageRequest.vessel);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() statusRequest: StatusRequest) {
    return this.packageService.updateStatus(id, statusRequest.status);
  }
  @UseGuards(JwtGuard)
  @Patch(':id/loaded')
  updateloaded(@Param('id', ParseIntPipe) id: number, @Body() body: LoadedRequest) {
    return this.packageService.updateLoaded(id, body.loaded);
  }
  @UseGuards(JwtGuard)
  @Patch(':id/received')
  updateReceived(@Param('id', ParseIntPipe) id: number, @Body() body: ReceivedRequest) {
    return this.packageService.updateReceived(id, body.received);
  }
  @UseGuards(JwtGuard)
  @Patch(':id/eta')
  updateEta(@Param('id', ParseIntPipe) id: number, @Body() body: EtaRequest) {
    return this.packageService.updateEta(id, body.eta);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageService.remove(+id);
  }
}
