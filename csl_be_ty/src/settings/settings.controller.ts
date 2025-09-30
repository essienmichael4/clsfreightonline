import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { BankDto, CreateInvoiceAddressDto, HelplineDto, MarqueDto, WarehouseDto } from './dto/request.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { Show } from './entities/marque.entity';

interface ShowUpdateRequest{
  show:Show
}

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @UseGuards(JwtGuard)
  @Post("marque")
  createMarqueAnnouncement(@Body() body: MarqueDto, @User() user:UserInfo){
    return this.settingsService.createMarqueAnnouncement(body, user.sub.id)
  }

  @UseGuards(JwtGuard)
  @Post("address")
  createInvoiceAddress(@Body() body: CreateInvoiceAddressDto){
    return this.settingsService.createInvoiceAddress(body)
  }

  @UseGuards(JwtGuard)
  @Post("warehouses")
  createWarehouse(@Body() body: WarehouseDto){
    return this.settingsService.createWarehouse(body)
  }

  @UseGuards(JwtGuard)
  @Post("banks")
  createBank(@Body() body: BankDto){
    return this.settingsService.createBank(body)
  }

  @UseGuards(JwtGuard)
  @Post("helplines")
  createHelpline(@Body() body: HelplineDto){
    return this.settingsService.createHelpline(body)
  }

  @UseGuards(JwtGuard)
  @Get("address")
  findInvoiceAddress(){
    return this.settingsService.findInvoiceAddress()
  }

  @Get("marque")
  findMarqueAnnouncement(){
    return this.settingsService.findMarqueAnnouncementForUser()
  }

  @UseGuards(JwtGuard)
  @Get("marque/all")
  findAllMarqueAnnouncement(){
    return this.settingsService.findAllMarqueAnnouncement()
  }

  @UseGuards(JwtGuard)
  @Get("warehouses")
  findWarehouses(){
    return this.settingsService.findWarehouses()
  }

  @UseGuards(JwtGuard)
  @Get("banks")
  findBanks(){
    return this.settingsService.findBanks()
  }

  @UseGuards(JwtGuard)
  @Get("helplines")
  findHelplines(){
    return this.settingsService.findHelplines()
  }

  @UseGuards(JwtGuard)
  @Patch("address/:id")
  updateInvoiceAddress(@Param('id', ParseIntPipe) id: number, @Body() body: CreateInvoiceAddressDto){
    return this.settingsService.updateInvoiceAddress(id, body)
  }

  @UseGuards(JwtGuard)
  @Patch("marque/:id")
  updateMarqueAnnouncement(@Param('id', ParseIntPipe) id: number, @Body() body: MarqueDto, @User() user:UserInfo){
    return this.settingsService.updateMarqueAnnouncement(id, body, user.sub.id)
  }

  @UseGuards(JwtGuard)
  @Patch("warehouses/:id")
  updateWarehouse(@Param('id', ParseIntPipe) id: number, @Body() body: WarehouseDto){
    return this.settingsService.updateWarehouse(id, body)
  }

  @UseGuards(JwtGuard)
  @Patch("banks/:id")
  updateBank(@Param('id', ParseIntPipe) id: number, @Body() body: BankDto){
    return this.settingsService.updateBank(id, body)
  }

  @UseGuards(JwtGuard)
  @Patch("helplines/:id")
  updateHelpline(@Param('id', ParseIntPipe) id: number, @Body() body: HelplineDto){
    return this.settingsService.updateHelpline(id, body)
  }

  @UseGuards(JwtGuard)
  @Patch('marque/:id/show')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: ShowUpdateRequest,  @User() user:UserInfo) {
    return this.settingsService.updateStatus(id, user.sub.id, body.show);
  }

  @UseGuards(JwtGuard)
  @Delete('marque/:id')
  deleteMarqueAnnouncemet(@Param('id', ParseIntPipe) id: number) {
    return this.settingsService.deleteMarqueAnnouncement(id);
  }
}
