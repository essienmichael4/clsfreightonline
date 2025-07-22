import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Deleted, Package, Status } from './entities/package.entity';
import { Brackets, DataSource, In, LessThan, Like, Not, Repository } from 'typeorm';
import { PackageEdit } from './entities/packageEdits.entity';
import { Client } from 'src/user/entities/client.entity';
import { PackageType } from './entities/packageType.entity';
import { PackageRateRequest } from './dto/package.dto';
import { PackageResponse } from './dto/package-response.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package) private readonly packageRepo:Repository<Package>, 
    @InjectRepository(Client) private readonly clientRepo:Repository<Client>, 
    @InjectRepository(PackageEdit) private readonly packageEditRepo:Repository<PackageEdit>,
    @InjectRepository(PackageType) private readonly packageTypeRepo:Repository<PackageType>,
    private userService: UserService,
    private readonly dataSource:DataSource
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

  async findAll(pageOptionsDto:PageOptionsDto, search?:string, status?:Status) {
    const query = this.packageRepo
      .createQueryBuilder("package")
      .leftJoinAndSelect("package.client", "client")
      .leftJoinAndSelect("package.packageType", "packageType")
      .where("package.isDeleted != :deleted", { deleted: "TRUE" });

    if (status) {
      query.andWhere("package.status = :status", { status });
    }
    if (search) {
      query.andWhere(
        new Brackets(qb => {
          qb.where("package.trackingNumber LIKE :search", { search: `%${search}%` })
            .orWhere("client.name LIKE :search", { search: `%${search}%` })
            .orWhere("package.customer LIKE :search", { search: `%${search}%` })
            .orWhere("client.email LIKE :search", { search: `%${search}%` })
            .orWhere("packageType.description LIKE :search", { search: `%${search}%` });
        })
      );
    }
    
    const [data, total] = await query
    .orderBy("package.id", "DESC")
    .skip(pageOptionsDto.skip)
    .take(pageOptionsDto.take)
    .getManyAndCount();

    const pageMetaDto = new PageMetaDto({itemCount: total, pageOptionsDto})
    return new PageDto(data, pageMetaDto)
  }

  async findAllByStatus(status?:Status) {
    return await this.packageRepo.find({
      relations: {
        client: true,
        packageType: true
      },
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
        trackingNumber: In(trackingNumbers),
        isDeleted: Not("TRUE" as Deleted)
      },
    });
  }

  async findRecentPackages() {
    return await this.packageRepo.find({
      relations: {
        client: true,
        packageType: true
      },
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
        client: true,
        packageType: true
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
        client: true,
        packageType: true
      },
      where: {
        isDeleted: Deleted.FALSE,
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
        isDeleted: Deleted.FALSE,
        status : "YET_TO_LOAD" as Status
      }
    });
  }

  async findEnroutCount() {
    return await this.packageRepo.count({
      where: {
        isDeleted: Deleted.FALSE,
        status : "EN_ROUTE" as Status
      }
    });
  }

  async findArrivedCount() {
    return await this.packageRepo.count({
      where: {
        isDeleted: Deleted.FALSE,
        status : "ARRIVED" as Status
      }
    });
  }

  async findOneById(id: number) {
    const packageType = await this.packageTypeRepo.find()
    const foundPackage = await this.packageRepo.findOne({
      where:{
        isDeleted: Deleted.FALSE,
        id
      },
      relations: {
        client: {
          attachments: true
        },
        packageType: true,
        
      }
    });

    const packageResponse = new PackageResponse(foundPackage)
    const cedisRate = packageResponse.packageType?.cedisRate || packageType[0]?.cedisRate || 0
    const dollarRate = packageResponse.packageType?.rate || packageType[0]?.rate || 0
    packageResponse.dollarEstimate = (packageResponse.cbm * dollarRate).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })
    packageResponse.cedisEstimate = (packageResponse.cbm * cedisRate).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })

    return packageResponse
  }

  async findOneByTrackingNumber(trackingNumber: string) {
    const packageType = await this.packageTypeRepo.find()
    const foundPackage = await this.packageRepo.findOne({
      where:{
        isDeleted: Deleted.FALSE,
        trackingNumber
      }
    });

    const packageResponse = new PackageResponse(foundPackage)
    const cedisRate = packageResponse.packageType.cedisRate || packageType[0].cedisRate || 0
    const dollarRate = packageResponse.packageType.rate || packageType[0].rate || 0
    packageResponse.dollarEstimate = (packageResponse.cbm * dollarRate).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })
    packageResponse.cedisEstimate = (packageResponse.cbm * cedisRate).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })

    return packageResponse
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
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let shippingRate = 0;
      let client: Client | null = null;

      if (status === "DELIVERED") {
        const pack = await queryRunner.manager.findOne(Package, {
          where: { id },
          relations: { packageType: true, client: true },
        });

        if (!pack) throw new NotFoundException("Package not found");

        client = pack.client;
        
        if (!pack.packageType) {
          const defaultPackageType = await queryRunner.manager.findOne(PackageType, {
            where: {},
            order: { id: "ASC" }
          });

          if (!defaultPackageType) throw new Error("No package type found");

          shippingRate = defaultPackageType.rate;
        } else {
          shippingRate = pack.packageType.rate;
        }

        const addedRate = shippingRate * pack.cbm;
        client.totalShippingRate = client.totalShippingRate + addedRate;

        // Update client totalShippingRate
        await queryRunner.manager.update(Client, client.id, {
          totalShippingRate: client.totalShippingRate
        });
        

        // Optional: trigger membership tier evaluation
        await this.userService.evaluateMembershipTier(client.id, queryRunner.manager); // <- optional and new
      }

      // Update package status and shipping rate (if DELIVERED)
      await queryRunner.manager.update(Package, id, {
        status,
        ...(status === "DELIVERED" && { shippingRate }),
      });

      await queryRunner.commitTransaction();
      console.log(client);
      
      return { message: "Package status updated successfully" };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
