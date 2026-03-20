import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Deleted, Package, Status } from './entities/package.entity';
import { Between, Brackets, DataSource, In, Not, QueryRunner, Repository } from 'typeorm';
import { Client } from 'src/user/entities/client.entity';
import { PackageType } from './entities/packageType.entity';
import { PackageRateRequest, RateRequest } from './dto/package.dto';
import { PackageResponse } from './dto/package-response.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { UserService } from 'src/user/user.service';
import { endOfDay, format, parseISO, startOfDay } from 'date-fns';
import { Rate } from 'src/settings/entities/rate.entity';
import * as XLSX from 'xlsx';
import { removeChinese } from 'src/helpers/common';
import { DateFilterDto } from './dto/date-filter.dto';
import { UpdatePackagesStatusDto } from './dto/update-package.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PackageService {
  private readonly logger = new Logger(PackageService.name);

  constructor(
    @InjectRepository(Package) private readonly packageRepo:Repository<Package>, 
    @InjectRepository(Client) private readonly clientRepo:Repository<Client>,
    @InjectRepository(PackageType) private readonly packageTypeRepo:Repository<PackageType>,
    @InjectRepository(Rate) private readonly rateRepo:Repository<Rate>,
    private userService: UserService,
    private readonly dataSource:DataSource,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ){}

  private parseExcelDate(value: any): string | null {
    if (!value) return null;

    // Excel serial number
    if (typeof value === 'number') {
      const date = XLSX.SSF.parse_date_code(value);
      if (!date) return null;
      const mm = String(date.m).padStart(2, '0');
      const dd = String(date.d).padStart(2, '0');
      return `${date.y}-${mm}-${dd} 00:00:00`;
    }

    if (typeof value === 'string') {
      const cleaned = removeChinese(value).trim();
      if (!cleaned) return null;

      // Handle "2026.2.4" or "2026.02.04" format
      const dotFormat = cleaned.match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/);
      if (dotFormat) {
        const [_, yyyy, mm, dd] = dotFormat;
        return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')} 00:00:00`;
      }

      // Fallback for "YYYY-MM-DD" or other parseable strings
      const parsed = new Date(cleaned);
      if (isNaN(parsed.getTime())) return null;
      const yyyy = parsed.getFullYear();
      const mm = String(parsed.getMonth() + 1).padStart(2, '0');
      const dd = String(parsed.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} 00:00:00`;
    }

    return null;
  }

  async create( createPackageDto: CreatePackageDto, shippingMark?: string, packageType?: string) {
    const sanitizedDto = {
      ...createPackageDto,
      ...(createPackageDto.received && { 
        received: `${createPackageDto.received.split('T')[0]} 00:00:00` 
      }),
      ...(createPackageDto.loaded && { 
        loaded: `${createPackageDto.loaded.split('T')[0]} 00:00:00` 
      }),
    }
    if(shippingMark){
      const client = await this.clientRepo.findOne({
        where: {shippingMark}
      })

      let packageRateType = null
      if(packageType){
        packageRateType = await this.packageTypeRepo.findOne({
          where: {
            description: packageType
          }
        })
      }

      const createPackage = this.packageRepo.create({...sanitizedDto, client, packageType: packageRateType})
      return await this.packageRepo.save(createPackage);
    }

    const packaged = this.packageRepo.create(sanitizedDto)
    return await this.packageRepo.save(packaged);
  }

  async importPackages(file: Express.Multer.File, userId: number) {
    if (!file) throw new BadRequestException('No file uploaded');

    const workbook = XLSX.read(file.buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: null,         // use null so we can distinguish truly empty vs merged
    });

    if (!rawRows.length) throw new BadRequestException('Empty Excel file');

    const headerIndex = rawRows.findIndex((row) =>
      row.some(
        (cell) =>
          typeof cell === 'string' &&
          cell.trim().toLowerCase().includes('shipping mark'),
      ),
    );

    if (headerIndex === -1) {
      throw new BadRequestException('Shipping Mark column not found');
    }

    const headers = rawRows[headerIndex].map((h) => String(h).trim().toLowerCase());
    const dataRows = rawRows.slice(headerIndex + 1);

    // 🔹 Forward-fill: carry last non-null value down each column
    const lastSeen: Record<number, any> = {};
    const filledRows = dataRows.map((row) => {
      return row.map((cell, colIndex) => {
        if (cell !== null && cell !== undefined && cell !== '') {
          lastSeen[colIndex] = cell;   // update last seen value for this column
          return cell;
        }
        return lastSeen[colIndex] ?? null;  // fill from last seen
      });
    });

    // Convert to JSON using normalized headers
    const rows = filledRows.map((row) => {
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    let success = 0;
    let skipped = 0;
    const duplicateTrackingNumbers: string[] = [];

    await this.dataSource.transaction(async (manager) => {
      for (const row of rows) {
        try {
          const trackingNumber = removeChinese(row['tracking number']);

          if (!trackingNumber) {
            skipped++;
            continue;
          }

          const existing = await manager.findOne(Package, { where: { trackingNumber } });
          if (existing) {
            duplicateTrackingNumbers.push(trackingNumber);
            continue;
          }

          const shippingMark = String(row['shipping mark'] || '').trim();
          const client = shippingMark
            ? await manager.findOne(Client, { where: { shippingMark } })
            : null;

          const pkg = manager.create(Package, {
            client: client ?? undefined,
            trackingNumber,
            customer: removeChinese(row['customer'] || row['shipping mark'] || ''),
            cbm: Number(removeChinese(row['cbm'] || 0)),
            package: removeChinese(row['package'] || ''),
            quantity: Number(removeChinese(row['quantity'] || 1)),
            weight: Number(removeChinese(row['weight'] || 0)),
            received: this.parseExcelDate(row['receiving date']),  // ✅
            loaded: this.parseExcelDate(row['loading date']), 
            description: removeChinese(row['description'] || ''),
            vessel: removeChinese(row['vessel'] || ''),
            isDeleted: Deleted.FALSE,
            status: Status.YET_TO_LOAD,
            addedBy: userId,
          });

          await manager.save(pkg);
          success++;
        } catch (error) {
          skipped++;
        }
      }
    });

    return { 
      total: rows.length, 
      success, 
      duplicates: duplicateTrackingNumbers.length,
      ...(duplicateTrackingNumbers.length > 0 && { duplicateTrackingNumbers }),
      skipped 
    };
  }

  async addPackageTypeAndRate(packageRate:PackageRateRequest){
    const packageTypeAndRate = this.packageTypeRepo.create({...packageRate})
    return await this.packageTypeRepo.save(packageTypeAndRate)
  }

  async addRate(rateRequest:RateRequest){
    const rate = this.rateRepo.create({...rateRequest})
    return await this.rateRepo.save(rate)
  }

  async editRate(rateRequest:RateRequest, id:number){
    const rate = await this.rateRepo.update(id, {...rateRequest})
    return await this.rateRepo.findOne({where: {id}})
  }

  async findPackageTypesAndRates(){
    return await this.packageTypeRepo.find()
  }

  async findRate(){
    return await this.rateRepo.findOne({where: {id: 1}})
  }

  async findAll(pageOptionsDto:PageOptionsDto, search?:string, status?:Status, dateFilter?: DateFilterDto) {
    const query = this.packageRepo
      .createQueryBuilder("package")
      .leftJoinAndSelect("package.client", "client")
      .leftJoinAndSelect("package.packageType", "packageType")
      .where("package.isDeleted != :deleted", { deleted: "TRUE" });

    if (dateFilter) {
      if (dateFilter.receivedFrom) {
        const parsedDate = parseISO(dateFilter.receivedFrom);
        const parsedDateEnd = parseISO(dateFilter.receivedTo || dateFilter.receivedFrom); 
        const from = startOfDay(parsedDate).toISOString();
        const to = endOfDay(parsedDateEnd).toISOString();
        query.andWhere("package.received BETWEEN :from AND :to", { from, to });
      }

      if (dateFilter.loadedFrom) {
        const parsedDate = parseISO(dateFilter.loadedFrom);
        const parsedDateEnd = parseISO(dateFilter.loadedTo || dateFilter.loadedFrom);
      
        const from = startOfDay(parsedDate).toISOString();
        const to = endOfDay(parsedDateEnd).toISOString();
        query.andWhere("package.loaded BETWEEN :from AND :to", { from, to });
      }
    }

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

  async findAllPackagesByLoadedDate(pageOptionsDto: PageOptionsDto, loaded?: string) {
    const query = this.packageRepo
      .createQueryBuilder("package")
      .leftJoinAndSelect("package.client", "client")
      .leftJoinAndSelect("package.packageType", "packageType")
      .where("package.isDeleted != :deleted", { deleted: "TRUE" });

    if (loaded) {
      const parsedDate = parseISO(loaded);
      
      const from = startOfDay(parsedDate).toISOString();
      const to = endOfDay(parsedDate).toISOString();
      query.andWhere(
        "package.loaded BETWEEN :from AND :to",
        { from, to },
      );
    }

    const [data, total] = await query
      .orderBy("package.id", "DESC")
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto,
    });

    return new PageDto(data, pageMetaDto);
  }

  async findAllPackagesByReceivedDate(pageOptionsDto: PageOptionsDto, received?: string,) {
    const query = this.packageRepo
      .createQueryBuilder("package")
      .leftJoinAndSelect("package.client", "client")
      .leftJoinAndSelect("package.packageType", "packageType")
      .where("package.isDeleted != :deleted", { deleted: "TRUE" });

    if (received) {
      // parseISO treats "2025-03-07" as local time, not UTC midnight
      const parsedDate = parseISO(received);
      
      const from = startOfDay(parsedDate).toISOString();
      const to = endOfDay(parsedDate).toISOString();

      query.andWhere(
        "package.received BETWEEN :from AND :to",
        { from, to },
      );
    }

    const [data, total] = await query
      .orderBy("package.id", "DESC")
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto,
    });

    return new PageDto(data, pageMetaDto);
  }

  async findAllClientPackages(id: number, search?: string, loadedDate?: string) {
    const query = this.packageRepo
      .createQueryBuilder("package")
      .leftJoinAndSelect("package.client", "client")
      .leftJoinAndSelect("package.packageType", "packageType")
      .where("package.isDeleted != :deleted", { deleted: "TRUE" });

    if (id) {
      query.andWhere("package.client.id = :id", { id });
    }

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where("package.trackingNumber LIKE :search", {
            search: `%${search}%`,
          })
            .orWhere("client.name LIKE :search", { search: `%${search}%` })
            .orWhere("package.customer LIKE :search", {
              search: `%${search}%`,
            })
            .orWhere("client.email LIKE :search", { search: `%${search}%` })
            .orWhere("packageType.description LIKE :search", {
              search: `%${search}%`,
            });
        }),
      );
    }

    if (loadedDate) {
      const parsedDate = parseISO(loadedDate);
      
      const from = startOfDay(parsedDate).toISOString();
      const to = endOfDay(parsedDate).toISOString();

      query.andWhere("package.loaded BETWEEN :from AND :to", { from, to });
    }

    const data = await query
      .orderBy("package.id", "DESC")
      .getMany();

    return data
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

  async findIntransitCount() {
    return await this.packageRepo.count({
      where: {
        isDeleted: Deleted.FALSE,
        status : "IN_TRANSIT" as Status
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

  async update(id: number, trackingNumber?:string, customer?:string, email?:string, phone?:string, vessel?:string, packageName?:string, cbm?:number, quantity?:number, description?:string, shippingMark?:string, packageType?:string, weight?:number) {    
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
          description: packageType
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
      ...(weight !== undefined && { weight }), // 0 is valid
      ...(quantity !== undefined && { quantity }), // 0 is valid
      ...(client && { client }),
      ...(packageRateType && {packageType: packageRateType}),
      description: description ?? "", // preserves empty string if passed
    });

    return pack
  }

  async updateBatchStatuses({ ids, status, loaded, eta, vessel }: UpdatePackagesStatusDto) {
    if (!ids?.length) {
      throw new BadRequestException('At least one package ID must be provided');
    }

    const result = await this.runInTransaction(async (queryRunner) => {
      if (status === Status.DELIVERED) {
        const packages = await queryRunner.manager.find(Package, {
          where: { id: In(ids) },
          relations: { packageType: true, client: true },
        });

        if (!packages.length) {
          throw new NotFoundException('No packages found for the provided IDs');
        }

        await this.applyDeliveredLogic(packages, queryRunner);
      }

      const result = await queryRunner.manager.update(
        Package,
        { id: In(ids) },
        {
          status,
          ...(loaded && { loaded: `${loaded.split('T')[0]} 00:00:00` }),
          ...(eta    && { eta:    `${eta.split('T')[0]} 00:00:00`    }),
          ...(vessel && { vessel }),
        },
      );

      if (result.affected === 0) {
        throw new NotFoundException('No packages found for the provided IDs');
      }

      return result;
    });

    this.sendStatusSms(ids, status).catch(err =>
      this.logger.error('SMS notification failed', err),
    );

    return {
      message: `${result.affected} package(s) updated to ${status}`,
      count: result.affected,
    };
  }

  async updateByLoadedDate(status: Status, loaded: string) {
    const { start, end } = this.getDayRange(loaded);

    const { result, ids } = await this.runInTransaction(async (queryRunner) => {
      const packages = await queryRunner.manager.find(Package, {
        where: { loaded: Between(start, end) },
        relations: { packageType: true, client: true },
      });

      if (!packages.length) {
        throw new NotFoundException('No packages found for the provided loaded date');
      }

      if (status === Status.DELIVERED) {
        await this.applyDeliveredLogic(packages, queryRunner);
      }

      const result = await queryRunner.manager.update(
        Package,
        { loaded: Between(start, end) },
        { status },
      );

      return { result, ids: packages.map(p => p.id) };
    });

    this.sendStatusSms(ids, status).catch(err =>
      this.logger.error('SMS notification failed', err),
    );

    return result;
  }

  async updateByRecievedDate(status: Status, received: string, loaded?: string, eta?: string) {
    const { start, end } = this.getDayRange(received);

    const { result, ids } = await this.runInTransaction(async (queryRunner) => {
      const packages = await queryRunner.manager.find(Package, {
        where: { received: Between(start, end) },
        relations: { packageType: true, client: true },
      });

      if (!packages.length) {
        throw new NotFoundException('No packages found for the provided received date');
      }

      if (status === Status.DELIVERED) {
        await this.applyDeliveredLogic(packages, queryRunner);
      }

      const result = await queryRunner.manager.update(
        Package,
        { received: Between(start, end) },
        {
          status,
          ...(loaded && { loaded: new Date(loaded) }),
          ...(eta    && { eta:    new Date(eta)    }),
        },
      );

      return { result, ids: packages.map(p => p.id) };
    });

    this.sendStatusSms(ids, status).catch(err =>
      this.logger.error('SMS notification failed', err),
    );

    return result;
  }

  async updateStatus(id: number, status: Status) {
    await this.runInTransaction(async (queryRunner) => {
      if (status === Status.DELIVERED) {
        const pack = await queryRunner.manager.findOne(Package, {
          where: { id },
          relations: { packageType: true, client: true },
        });

        if (!pack) throw new NotFoundException('Package not found');

        await this.applyDeliveredLogic([pack], queryRunner);
      }

      await queryRunner.manager.update(Package, id, { status });
    });

    await this.sendStatusSms([id], status).catch(err =>
      this.logger.error('SMS notification failed', err),
    );

    return { message: 'Package status updated successfully' };
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

  async removeRate(id: number) {
    return await this.packageTypeRepo.delete(id);
  }

  async remove(id: number) {
    return await this.packageRepo.delete(id);
  }

  // --- Private helpers ---
  private getDayRange(dateStr: string): { start: Date; end: Date } {
    const date = new Date(dateStr);

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  private async applyDeliveredLogic(
    packages: Package[],
    queryRunner: QueryRunner,
  ): Promise<void> {
    for (const pack of packages) {
      let shippingRate = 0;

      if (!pack.packageType) {
        const defaultPackageType = await queryRunner.manager.findOne(PackageType, {
          where: {},
          order: { id: 'ASC' },
        });

        if (!defaultPackageType) throw new Error('No package type found');

        shippingRate = defaultPackageType.rate;
      } else {
        shippingRate = pack.packageType.rate;
      }

      const addedRate = shippingRate * pack.cbm;
      pack.client.totalShippingRate = pack.client.totalShippingRate + addedRate;

      await queryRunner.manager.update(Client, pack.client.id, {
        totalShippingRate: pack.client.totalShippingRate,
      });

      await this.userService.evaluateMembershipTier(pack.client.id, queryRunner.manager);

      await queryRunner.manager.update(Package, pack.id, {
        shippingRate,
      });
    }
  }

  private async runInTransaction<T>(
    fn: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await fn(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async sendStatusSms(ids: number[], status: Status): Promise<void> {
    const message = this.resolveStatusMessage(status);
    if (!message) return; // No SMS defined for this status — skip silently

    const packages = await this.packageRepo.find({
      where: { id: In(ids) },
      relations: ['client'], // ✅ correct way to load relations in TypeORM
    });

    // Deduplicate phone numbers so clients with multiple packages get one SMS
    const recipients = [...new Set(
      packages.map(p => p.client?.phone).filter(Boolean)
    )];

    if (!recipients.length) return;

    const payload = {
      recipient: recipients,
      sender: 'CSL Freight',
      message,
      is_schedule: false,
      schedule_date: '',
    };

    const response = await firstValueFrom(
      this.httpService.post(
        `https://api.mnotify.com/api/sms/quick?key=${this.configService.getOrThrow('SMS_API_KEY')}`,
        payload,
        { headers: { 'Content-Type': 'application/json' } },
      ),
    );

    if (response.data?.status !== 'success') {
      throw new Error(`SMS API returned unexpected response: ${JSON.stringify(response.data)}`);
    }
  }

  private resolveStatusMessage(status: Status): string | null {
    const messages: Partial<Record<Status, string>> = {
      [Status.IN_TRANSIT]: 'Your shipment is currently in transit to Ghana. Track progress anytime via your CSL dashboard. Thank you for choosing CSL Freight.',
      [Status.ARRIVED]:    'Your shipment has arrived at Tema Port and is undergoing clearance. You will be notified once it is ready for collection or delivery.',
      [Status.DELIVERED]:  'Your shipment has been delivered to our warehouse. Please take time to fill a pickup or delivery form so as to get your packages ready for timely delivery. Thank you for choosing CSL Freight. We look forward to serving you again.',
    };
    return messages[status] ?? null;
  }
}
