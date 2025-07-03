import { Injectable } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Deleted, Package, Status } from './entities/package.entity';
import { In, LessThan, Not, Repository } from 'typeorm';
import { PackageEdit } from './entities/packageEdits.entity';
import { Client } from 'src/user/entities/client.entity';
import { PackageType } from './entities/packageType.entity';
import { PackageRateRequest } from './dto/package.dto';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package) private readonly packageRepo:Repository<Package>, 
    @InjectRepository(Client) private readonly clientRepo:Repository<Client>, 
    @InjectRepository(PackageEdit) private readonly packageEditRepo:Repository<PackageEdit>,
    @InjectRepository(PackageType) private readonly packageTypeRepo:Repository<PackageType>
  ){}

  async create( createPackageDto: CreatePackageDto, shippingMark?: string, packageType?: string) {
    if(shippingMark){
      const client = await this.clientRepo.findOne({
        where: {shippingMark}
      })

      let packageRateType = null
      if(packageType){
        packageRateType = await this.packageTypeRepo.findOne({
          where: {
            description: packageRateType
          }
        })
      }

      const createPackage = this.packageRepo.create({...createPackageDto, client, packageType: packageRateType})
      return await this.packageRepo.save(createPackage);
    }

    const packaged = this.packageRepo.create(createPackageDto)
    return await this.packageRepo.save(packaged);
  }

  async addPackageTypeAndRate(packageRate:PackageRateRequest){
    const packageTypeAndRate = this.packageTypeRepo.create({...packageRate})
    return await this.packageTypeRepo.save(packageTypeAndRate)
  }

  async findPackageTypesAndRates(){
    return await this.packageTypeRepo.find()
  }

  async findAll() {
    return await this.packageRepo.find({
      where:{
        isDeleted: Not("TRUE" as Deleted)
      },
      order: {
        id: "DESC", 
      },
    });
  }

  async findAllByStatus(status:Status) {
    return await this.packageRepo.find({
      where:{
        isDeleted: Not("TRUE" as Deleted),
        status
      },
      order: {
        id: "DESC", 
      },
    });
  }

  async findAllWithTrackingNumbers(trackingNumbers:string[]) {
    return await this.packageRepo.find({
      where:{
        trackingNumber: In(trackingNumbers)
      },
    });
  }

  async findRecentPackages() {
    return await this.packageRepo.find({
      where: {
        isDeleted: Deleted.FALSE
      },
      order: {
        id: "DESC", 
      },take:20
    });
  }

  async findClientPackages(clientId: number, status?:Status) {
    return await this.packageRepo.find({
      relations: {
        client: true
      },
      where: {
        isDeleted: Deleted.FALSE,
        ...(status && {status}),
        client: {
          id: clientId
        }
      },
      order: {
        id: "DESC", 
      }
    });
  }

  async findClientRecentPackages(clientId: number) {
    return await this.packageRepo.find({
      relations: {
        client: true
      },
      where: {
        client: {
          id: clientId
        }
      },
      order: {
        id: "DESC", 
      },take:20
    });
  }

  async findLoadedCount() {
    return await this.packageRepo.count({
      where: {
        status : "YET_TO_LOAD" as Status
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
    return await this.packageRepo.findOne({
      where:{id},
      relations: {
        client: true
      }
    });
  }

  async findOneByTrackingNumber(trackingNumber: string) {
    return await this.packageRepo.findOneBy({trackingNumber});
  }

  async update(id: number, trackingNumber?:string, customer?:string, email?:string, phone?:string, vessel?:string, packageName?:string, cbm?:number, quantity?:number, description?:string, shippingMark?:string, packageType?:string) {    
    let client = null;
    let packageRateType = null
    if (shippingMark) {
      client = await this.clientRepo.findOne({
        where: { shippingMark },
      });
    }

    if(packageType){
      packageRateType = await this.packageTypeRepo.findOne({
        where: {
          description: packageRateType
        }
      })
    }

    const pack = await this.packageRepo.save({id,
      ...(trackingNumber && { trackingNumber }),
      ...(vessel && { vessel }),
      ...(customer && { customer }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(packageName && { package: packageName }),
      ...(cbm !== undefined && { cbm }), // 0 is valid
      ...(quantity !== undefined && { quantity }), // 0 is valid
      ...(client && { client }),
      ...(packageRateType && {packageType: packageRateType}),
      description: description ?? "", // preserves empty string if passed
    });

    return pack
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

  async updateDeparture(id: number, departure: string) {
    return await this.packageRepo.update(id, {
      departure
    });
  }

  async updatePackageTypeAndRate(id:number, packageRate:PackageRateRequest){
    return await this.packageTypeRepo.update(id, {
      ...packageRate
    })
  }

  async remove(id: number) {
    return await this.packageRepo.delete(id);
  }
}
