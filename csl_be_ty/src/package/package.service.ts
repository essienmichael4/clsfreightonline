import { Injectable } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
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

  async findOneById(id: number) {
    return await this.packageRepo.findOneBy({id});
  }

  async findOneByTrackingNumber(trackingNumber: string) {
    return await this.packageRepo.findOneBy({trackingNumber});
  }

  update(id: number, updatePackageDto: UpdatePackageDto) {
    return `This action updates a #${id} package`;
  }

  remove(id: number) {
    return `This action removes a #${id} package`;
  }
}
