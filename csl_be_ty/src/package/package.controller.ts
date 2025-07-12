import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { PackageService } from './package.service';
import { EditPackageRequest, PackageRateRequest, PackageRequest } from './dto/package.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { Status } from './entities/package.entity';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';

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
      received: body.received,
      description: body.description,
    }, body.shippingMark, body.packageType);
  }

  @UseGuards(JwtGuard)
  @Post("shipping-rates")
  createPackageRate(@Body() body: PackageRateRequest,) {
    return this.packageService.addPackageTypeAndRate(body)
  }

  @UseGuards(JwtGuard)
  @Get("shipping-rates")
  findPackageRate() {
    return this.packageService.findPackageTypesAndRates()
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Query() pageOptionsDto:PageOptionsDto, @Query("search") search?: string,@Query("status") status?:Status) {
    return this.packageService.findAll(pageOptionsDto, search, status);
  }

  @Get("search")
  findPakages(@Query("filter") filter:string) {
    const search = filter.split(',')
    return this.packageService.findAllWithTrackingNumbers(search);
  }

  @UseGuards(JwtGuard)
  @Get('dashboard')
  findForDashboard() {
    return this.packageService.findRecentPackages();
  }

  @UseGuards(JwtGuard)
  @Get('client')
  findClientPackages(@User() user:UserInfo, @Query("status") status?:Status) {
    return this.packageService.findClientPackages(user.sub.id, status);
  }

  @UseGuards(JwtGuard)
  @Get('summary/client')
  findForClientDashboard(@User() user:UserInfo) {
    return this.packageService.findClientRecentPackages(user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Get('dashboard/loaded')
  async findDashboardLoaded() {
     const count = await this.packageService.findLoadedCount();
     return {count}
  }

  @UseGuards(JwtGuard)
  @Get('dashboard/enroute')
  async findDashboardEnRoute() {
     const count = await this.packageService.findEnroutCount();     
     return {count}
  }

  @UseGuards(JwtGuard)
  @Get('dashboard/arrived')
  async findDashboardArrived() {
     const count = await this.packageService.findArrivedCount();     
     return {count}
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.packageService.findOneById(id);
  }

  @UseGuards(JwtGuard)
  @Get(':trackingNumber')
  findWithTrackingNumber(@Param('trackingNumber') trackingNumber: string) {
    return this.packageService.findOneByTrackingNumber(trackingNumber);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updatePackage(@Param('id', ParseIntPipe) id: number, @Body() editPackageRequest: EditPackageRequest) {
    return await this.packageService.update(id, editPackageRequest.trackingNumber, editPackageRequest.customer, editPackageRequest.email, editPackageRequest.phone, editPackageRequest.vessel, editPackageRequest.package, editPackageRequest.cbm,editPackageRequest.quantity, editPackageRequest.description, editPackageRequest.shippingMark, editPackageRequest.packageType);
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
  @Patch(':id/departure')
  updateDeparture(@Param('id', ParseIntPipe) id: number, @Body() body: EtaRequest) {
    return this.packageService.updateDeparture(id, body.eta);
  }

  @UseGuards(JwtGuard)
  @Patch("shipping-rates/:id")
  updatePackageRate(@Param('id', ParseIntPipe) id: number, @Body() body: PackageRateRequest,) {
    return this.packageService.updatePackageTypeAndRate(id, body)
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.packageService.remove(id);
  }
}
