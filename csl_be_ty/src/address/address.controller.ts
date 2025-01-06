import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';

interface AddressCreateRequest{
  name:string,
  contact:string
  mobile:string
  address:string
}

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() body: AddressCreateRequest, @User() user:UserInfo) {
    return this.addressService.create({name:body.name, mobile:body.mobile, contact:body.contact, address:body.address, updatedBy:user.sub.id});
  }

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}
