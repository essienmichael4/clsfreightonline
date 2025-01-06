import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AddressService {
  constructor(@InjectRepository(Address) private readonly addressRepo:Repository<Address>, private userService: UserService,){}
  async create(createAddressDto: CreateAddressDto) {
    const user = await this.userService.findUserById(createAddressDto.updatedBy)

    const address = this.addressRepo.create({
          name: createAddressDto.name,
          contact: createAddressDto.contact,
          updatedBy:  user || undefined,
          mobile: createAddressDto.mobile,
          address: createAddressDto.address
        });
    
        return await this.addressRepo.save(address)
  }

  async findAll() {
    return await this.addressRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
