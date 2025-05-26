import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { LoadingService } from './loading.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { Status } from './entities/loading.entity';

interface LoadingRequest{
  status:Status,
  vessel: string,
  loaded: string,
  eta: string
  description?:string
}

interface UpdateLoadingRequest{
  status?:Status,
  vessel?: string,
  loaded?: string,
  eta?: string
  description?:string
}

interface StatusRequest{
  status:Status
}

@Controller('loadings')
export class LoadingController {
  constructor(private readonly loadingService: LoadingService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() body: LoadingRequest, @User() user:UserInfo) {
    return this.loadingService.create({vessel: body.vessel, eta: body.eta, loaded: body.loaded, status:body.status, addedBy:user.sub.id, description:body.description});
  }

  @Get()
  async findAll(@Query("status") status?:Status) {
    if(status){
      return await this.loadingService.findAllByStatus(status);
    }else{
      return await this.loadingService.findAll();
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.loadingService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateLoadingRequest, @User() user:UserInfo) {
    return this.loadingService.update(id, user.sub.id, body.vessel, body.eta, body.loaded, body.status);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() statusRequest: StatusRequest) {
    return this.loadingService.updateStatus(id, statusRequest.status);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.loadingService.remove(id);
  }
}
