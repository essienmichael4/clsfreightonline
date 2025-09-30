import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice, Status } from './entities/invoice.entity';
import { DataSource, In, Like, Repository } from 'typeorm';
import { Package } from 'src/package/entities/package.entity';
import { Client } from 'src/user/entities/client.entity';
import { User } from 'src/user/entities/user.entity';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { InvoiceResponseDto } from './dto/response.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice) private readonly invoiceRepo:Repository<Invoice>, 
    @InjectRepository(Package) private readonly packageRepo:Repository<Package>, 
    @InjectRepository(Client) private readonly clientRepo:Repository<Client>, 
    @InjectRepository(User) private readonly userRepo:Repository<User>, 
    private readonly dataSource:DataSource
  ){}

  async create(createInvoiceDto: CreateInvoiceDto, addedBy: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 🔹 Get client
      const client = await queryRunner.manager.findOne(Client, {
        where: { shippingMark: createInvoiceDto.shippingMark },
      });
      if (!client) {
        throw new NotFoundException(
          `Client with shippingMark "${createInvoiceDto.shippingMark}" not found`,
        );
      }

      // 🔹 Get user
      const user = await queryRunner.manager.findOne(User, {
        where: { id: addedBy },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${addedBy} not found`);
      }

      // 🔹 Get packages
      const packages = await queryRunner.manager.findBy(Package, {
        id: In(createInvoiceDto.packages),
      });
      if (!packages.length) {
        throw new BadRequestException(
          `No valid packages found for IDs: ${createInvoiceDto.packages}`,
        );
      }

      // 🔹 Generate invoice number per year
      const year = new Date().getFullYear();
      const latestInvoice = await queryRunner.manager.findOne(Invoice, {
        where: { invoiceNumber: Like(`INV-${year}-%`) },
        order: { id: 'DESC' },
      });

      let nextNumber = 1;
      if (latestInvoice?.invoiceNumber) {
        const match = latestInvoice.invoiceNumber.match(/INV-(\d{4})-(\d+)/);
        if (match) {
          nextNumber = parseInt(match[2], 10) + 1;
        }
      }

      const invoiceNumber = `INV-${year}-${String(nextNumber).padStart(4, '0')}`;

      // 🔹 Create invoice entity
      const invoice = this.invoiceRepo.create({
        invoiceNumber,
        invoiceId: createInvoiceDto.invoiceId,
        total: createInvoiceDto.total,
        totalCbm: createInvoiceDto.totalCbm,
        totalQty: createInvoiceDto.totalQty,
        rate: createInvoiceDto.rate,
        clientName: createInvoiceDto.clientName,
        companyName: createInvoiceDto.companyName,
        status: createInvoiceDto.status,
        issuedDate: createInvoiceDto.issued,
        eta: createInvoiceDto.eta,
        client,
        createdBy: user,
        packages,
      });

      // 🔹 Save invoice
      const savedInvoice = await queryRunner.manager.save(invoice);

      // 🔹 Commit transaction
      await queryRunner.commitTransaction();

      // 🔹 Return with relations
      return this.invoiceRepo.findOne({
        where: { id: savedInvoice.id },
        relations: ['client', 'packages', 'createdBy'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        error.message || 'Failed to create invoice',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAllInvoiceForAdmin(pageOptionsDto: PageOptionsDto, search?: string, status?: Status,) {
    const queryBuilder = this.invoiceRepo.createQueryBuilder("invoice")
      .leftJoinAndSelect("invoice.client", "client")
      .leftJoinAndSelect("invoice.createdBy", "createdBy")
      .leftJoinAndSelect("invoice.packages", "packages")
      .orderBy("invoice.id", "DESC")
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    // Search (case-insensitive, can search clientName, companyName, or invoiceNumber)
    if (search) {
      queryBuilder.andWhere(
        "(LOWER(invoice.clientName) LIKE LOWER(:search) OR LOWER(client.shippingMark) LIKE LOWER(:search) OR LOWER(invoice.invoiceNumber) LIKE LOWER(:search) OR LOWER(invoice.invoiceId) LIKE LOWER(:search))",
        { search: `%${search}%` },
      );
    }

    // Status filter
    if (status) {
      queryBuilder.andWhere("invoice.status = :status", { status });
    }

    const [invoices, total] = await queryBuilder.getManyAndCount();

    const response = invoices.map(
      (invoice) => new InvoiceResponseDto(invoice),
    );

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto,
    });

    return new PageDto(response, pageMetaDto);
  }


  findAll() {
    return `This action returns all invoice`;
  }

  findOne(id: number) {
    return this.invoiceRepo.findOne({
      where: {id},
      relations: {
        client: true,
        packages: true,
      }
    });
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 🔎 Find existing invoice
      const invoice = await this.invoiceRepo.findOne({
        where: { id },
        relations: ['client', 'packages', 'createdBy'],
      });

      if (!invoice) {
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }

      // 🔄 Update client if shippingMark is provided
      if (updateInvoiceDto.shippingMark) {
        const client = await this.clientRepo.findOne({
          where: { shippingMark: updateInvoiceDto.shippingMark },
        });
        if (!client) {
          throw new NotFoundException(
            `Client with shippingMark "${updateInvoiceDto.shippingMark}" not found`,
          );
        }
        invoice.client = client;
      }

      // 🔄 Update packages if provided
      if (updateInvoiceDto.packages && updateInvoiceDto.packages.length > 0) {
        const packages = await this.packageRepo.findBy({
          id: In(updateInvoiceDto.packages),
        });

        if (!packages.length) {
          throw new BadRequestException(
            `No valid packages found for IDs: ${updateInvoiceDto.packages}`,
          );
        }

        invoice.packages = packages;
      }

      // 🔄 Update other invoice fields
      Object.assign(invoice, {
        total: updateInvoiceDto.total ?? invoice.total,
        totalCbm: updateInvoiceDto.totalCbm ?? invoice.totalCbm,
        totalQty: updateInvoiceDto.totalQty ?? invoice.totalQty,
        rate: updateInvoiceDto.rate ?? invoice.rate,
        clientName: updateInvoiceDto.clientName ?? invoice.clientName,
        companyName: updateInvoiceDto.companyName ?? invoice.companyName,
        status: updateInvoiceDto.status ?? invoice.status,
      });

      // 💾 Save updated invoice
      const updatedInvoice = await queryRunner.manager.save(invoice);

      await queryRunner.commitTransaction();
      return updatedInvoice;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to update invoice',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }


  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
