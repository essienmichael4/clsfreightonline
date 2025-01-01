import { Injectable } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Package, Status } from './entities/package.entity';
import { Repository } from 'typeorm';
import { PackageEdit } from './entities/packageEdits.entity';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package) private readonly packageRepo:Repository<Package>, 
    @InjectRepository(PackageEdit) private readonly packageEditRepo:Repository<PackageEdit>
  ){}

  async create(createPackageDto: CreatePackageDto) {
    const packaged = this.packageRepo.create(createPackageDto)
    return await this.packageRepo.save(packaged);
  }

  async findAll() {
    return await this.packageRepo.find({
      order: {
        id: "DESC", 
      },
    });
  }

  async findRecent() {
    return await this.packageRepo.find({
      order: {
        id: "DESC", 
      },take:20
    });
  }

  async findLoadedCount() {
    return await this.packageRepo.count({
      where: {
        status : "ON_HOLD" as Status
      }
    });
  }

  async findEnroutCount() {
    return await this.packageRepo.count({
      where: {
        status : "EN_ROUTE" as Status
      }
    });
  }

  async findArrivedCount() {
    return await this.packageRepo.count({
      where: {
        status : "ARRIVED" as Status
      }
    });
  }

  async findOneById(id: number) {
    return await this.packageRepo.findOneBy({id});
  }

  async findOneByTrackingNumber(trackingNumber: string) {
    return await this.packageRepo.findOneBy({trackingNumber});
  }

  async update(id: number, trackingNumber?:string, customer?:string, email?:string, phone?:string, vessel?:string, packageName?:string, cbm?:number, quantity?:number) {
    return await this.packageRepo.update(id, {
      ...(trackingNumber && { trackingNumber }),
      ...(vessel && { vessel }),
      ...(customer && { customer }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(packageName && { package: packageName }),
      ...(cbm && { cbm }),
      ...(quantity && { quantity }),
    });
  }

  async updateStatus(id: number, status: Status) {
    return await this.packageRepo.update(id, {
      status
    });
  }
  async updateLoaded(id: number, loaded: string) {
    return await this.packageRepo.update(id, {
      loaded
    });
  }
  async updateReceived(id: number, received: string) {
    return await this.packageRepo.update(id, {
      received
    });
  }
  async updateEta(id: number, eta: string) {
    return await this.packageRepo.update(id, {
      eta
    });
  }

  remove(id: number) {
    return `This action removes a #${id} package`;
  }
}
