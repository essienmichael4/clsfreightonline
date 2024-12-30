import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PackageRequest } from './dto/package.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';

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
  findWithTrackingNumber(@Param('trackingNumber', ParseIntPipe) trackingNumber: string) {
    return this.packageService.findOneByTrackingNumber(trackingNumber);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packageService.update(+id, updatePackageDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageService.remove(+id);
  }
}
