import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PackageService } from './package.service';
import { EditPackageRequest, PackageRateRequest, PackageRequest, RateRequest } from './dto/package.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { Status } from './entities/package.entity';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { startOfDay, endOfDay } from 'date-fns';
import { PackageStatusRequest, UpdatePackagesStatusDto } from './dto/update-package.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPackages(@UploadedFile() file: Express.Multer.File, @User() user:UserInfo) {
    return this.packageService.importPackages(file, user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() body: PackageRequest, @User() user:UserInfo) {
    return this.packageService.create({
      customer: body.customer, 
      trackingNumber: body.trackingNumber,
      cbm: body.cbm,
      weight: body.weight,
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
  @Get("rate")
  findRate() {
    return this.packageService.findRate()
  }

  @UseGuards(JwtGuard)
  @Post("rate")
  addRate(@Body() body: RateRequest) {
    return this.packageService.addRate(body)
  }

  @UseGuards(JwtGuard)
  @Patch("rate/:id")
  editRate(@Param('id', ParseIntPipe) id: number, @Body() body: RateRequest) {
    return this.packageService.editRate(body, id)
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Query() pageOptionsDto:PageOptionsDto, @Query("search") search?: string,@Query("status") status?:Status,@Query("receivedFrom") receivedFrom?: string,
    @Query("receivedTo") receivedTo?: string,
    @Query("loadedFrom") loadedFrom?: string,
    @Query("loadedTo") loadedTo?: string,
  ) {
    return this.packageService.findAll(
      pageOptionsDto,
      search,
      status,
      { receivedFrom, receivedTo, loadedFrom, loadedTo }
    );
  }

  @UseGuards(JwtGuard)
  @Get("status")
  findAllPackagesByLoadedDate(@Query() pageOptionsDto:PageOptionsDto, @Query("loaded") loaded?: string, @Query("received") received?: string) {
    if (loaded) {
      return this.packageService.findAllPackagesByLoadedDate(pageOptionsDto, loaded);
    }else if (received) {
      return this.packageService.findAllPackagesByReceivedDate(pageOptionsDto, received);
    }else{
      return this.packageService.findAllPackagesByLoadedDate(pageOptionsDto);
    }
  }

  @UseGuards(JwtGuard)
  @Get("clients/:id")
  findAllClientPackagesForInvoice(@Param('id', ParseIntPipe) id: number, @Query("search") search?: string, @Query("loaded_date") loadedDate?: string, ) {
    return this.packageService.findAllClientPackages(id, search, loadedDate);
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
  @Get('dashboard/intransit')
  async findDashboardEnRoute() {
     const count = await this.packageService.findIntransitCount();     
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
  @Patch('status')
  async updatePackagesStatus(@Body() body: PackageStatusRequest) {
    if(body.loaded){
      return await this.packageService.updateByLoadedDate(body.status, body.loaded);
    }else if(body.received){
      return await this.packageService.updateByRecievedDate(body.status, body.received, body.loadedDate, body.eta);
    }
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updatePackage(@Param('id', ParseIntPipe) id: number, @Body() editPackageRequest: EditPackageRequest) {
    return await this.packageService.update(id, editPackageRequest.trackingNumber, editPackageRequest.customer, editPackageRequest.email, editPackageRequest.phone, editPackageRequest.vessel, editPackageRequest.package, editPackageRequest.cbm,editPackageRequest.quantity, editPackageRequest.description, editPackageRequest.shippingMark, editPackageRequest.packageType, editPackageRequest.weight);
  }

  @UseGuards(JwtGuard)
  @Patch('batch/statuses')
  updateBatchPackagesStatus(@Body() updatePackagesStatusDto: UpdatePackagesStatusDto,) {
    return this.packageService.updateBatchStatuses(updatePackagesStatusDto);
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
  @Delete("shipping-rates/:id")
  deletePackageRate(@Param('id', ParseIntPipe) id: number) {
    return this.packageService.removeRate(id)
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.packageService.remove(id);
  }
}
