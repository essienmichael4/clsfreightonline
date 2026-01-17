import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Brackets, EntityManager, In, Like, Repository } from 'typeorm';
import { Client, Deleted } from './entities/client.entity';
import { hash } from 'bcryptjs';
import { ClientApprovalUpdateRequest, ClientInfoUpdateRequest, ClientPaymentRequest } from './dto/updateUser.dto';
import { Details } from './entities/details.entity';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { Attachment } from './entities/attachment.entity';
import { AttachmentResponseDto, ClientResponseDto } from './dto/user-response.dto';
import { UploadService } from 'src/upload/upload.service';
import { MembershipTier } from './entities/membership.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateMembershipTierDto } from './dto/request.dto';
import { Payment } from './entities/payment.entity';
import { Department } from 'src/department/entities/department.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    @InjectRepository(Client) private readonly clientRepo:Repository<Client>,
    @InjectRepository(Department) private readonly departmentRepo:Repository<Department>,
    @InjectRepository(Payment) private readonly paymentRepo:Repository<Payment>,
    @InjectRepository(Details) private readonly detailsRepo:Repository<Details>,
    @InjectRepository(Attachment) private readonly attachmentRepo:Repository<Attachment>,
    @InjectRepository(MembershipTier) private readonly tierRepo:Repository<MembershipTier>,
    private readonly uploadService: UploadService,
  ){}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: await this.hashPassword(createUserDto.password),
      role: createUserDto.role,
    })
    if (createUserDto.departments && createUserDto.departments.length > 0) {
      // fetch departments by name or id
      const departments = await this.departmentRepo.find({
        where: {
          code: In(createUserDto.departments) // if using names
          // id: In(createUserDto.departments) // if using ID instead
        }
      });

      user.departments = departments;
    }
    return await this.userRepo.save(user)
  }

  async createMembershipTier(createMembershipTierDto: CreateMembershipTierDto) {
    const tier = this.tierRepo.create(createMembershipTierDto)
    return await this.tierRepo.save(tier)
  }

  async createClient(createUserDto: CreateClientDto) {
    const user = this.clientRepo.create(createUserDto)
    const clientDetails = this.detailsRepo.create({
      location: createUserDto.location,
    });

    user.accountStage = "new";
    user.clientDetails = clientDetails;
    return await this.clientRepo.save(user)
  }

  async addAttachment(id: number, attachment: string){
    const client = await this.findClientById(id)

    return await this.attachmentRepo.save({
      name: attachment,
      client
    })
  }

  async createPayment(clientMark: string, userId: number, payment: ClientPaymentRequest){
    const client = await this.findClientByShippingMark(clientMark)
    const user = await this.findUserById(userId)
    if(!client) throw new NotFoundException(`Client with ID:${clientMark} does not exist.`)
    if(!user) throw new NotFoundException(`User is not permitted to make this request as you do not exist.`)

    const saveEntity = this.paymentRepo.create({
      paidShippingRate: payment.paidShippingRate,
      reference: payment.reference,
      paymentMethod: payment.paymentMethod,
      ...(payment.datePaid && {datePaid: payment.datePaid}),
      client,
      user
    })

    return this.paymentRepo.save(saveEntity)
  }

  exportClients(){
    return this.clientRepo.find({
      select: {
        id: true,
        name: true,
        email: true,
        shippingMark: true,
        phone: true,
        createdAt: true
      }
    })
  }

  async findClients(pageOptionsDto: PageOptionsDto, search?: string) {
    const query = this.clientRepo
      .createQueryBuilder("client")
      .leftJoinAndSelect("client.clientDetails", "details");
      
    if (search) {
      query.where(
        "client.shippingMark LIKE :search OR client.email LIKE :search",
        { search: `%${search}%` },
      );
    }

    query.andWhere("client.isDeleted = :deleted", {
      deleted: Deleted.FALSE,
    });

    if (
      pageOptionsDto.skip !== undefined &&
      pageOptionsDto.take !== undefined
    ) {
      query.skip(pageOptionsDto.skip).take(pageOptionsDto.take);
    }

    // IMPORTANT: count must respect filters
    const clientsCount = await query.getCount();

    const clients = await query.getMany();

    const pageMetaDto = new PageMetaDto({
      itemCount: clientsCount,
      pageOptionsDto,
    });

    return new PageDto(clients, pageMetaDto);
  }

  async findMemberships(pageOptionsDto: PageOptionsDto, name?: string) {
    const query = this.clientRepo
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.membershipTier', 'membershipTier')
      .where('client.isDeleted = :deleted', { deleted: Deleted.FALSE });

    if (name) {
      query.andWhere('membershipTier.name = :name', { name });
    }

    query.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const [clients, count] = await query.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount: count,
      pageOptionsDto,
    });

    return new PageDto(clients, pageMetaDto)
  }

  async findMembershipsTiers(){
    const rawTiers = await this.tierRepo
      .createQueryBuilder("tier")
      .leftJoinAndSelect("tier.clients", "client")
      .loadRelationCountAndMap("tier.clientCount", "tier.clients")
      .orderBy("tier.priority", "ASC")
      .getMany();

    return rawTiers;
  }

  async findPayments(pageOptionsDto: PageOptionsDto, search?: string) {
    const query = this.paymentRepo
      .createQueryBuilder("payment")
      .leftJoinAndSelect("payment.client", "client")
      .leftJoinAndSelect("payment.user", "user")
      .orderBy("payment.id", "DESC")
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    if (search) {
      // Normalize the search string once
      const searchTerm = `%${search.toLowerCase()}%`;

      query.andWhere(
        new Brackets(qb => {
          // Use LOWER(...) → portable across Postgres & MySQL
          qb.where("LOWER(client.name) LIKE :search", { search: searchTerm })
            .orWhere("LOWER(client.shippingMark) LIKE :search", { search: searchTerm })
            .orWhere("LOWER(client.email) LIKE :search", { search: searchTerm });
        }),
      );
    }

    const [data, total] = await query.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto,
    });

    return new PageDto(data, pageMetaDto);
  }

  async exportPayments(search?: string) {
    const query = this.paymentRepo
      .createQueryBuilder("payment")
      .leftJoinAndSelect("payment.client", "client")
      .leftJoinAndSelect("payment.user", "user")
      .orderBy("payment.id", "DESC")

    if (search) {
      // Normalize the search string once
      const searchTerm = `%${search.toLowerCase()}%`;

      query.andWhere(
        new Brackets(qb => {
          // Use LOWER(...) → portable across Postgres & MySQL
          qb.where("LOWER(client.name) LIKE :search", { search: searchTerm })
            .orWhere("LOWER(client.shippingMark) LIKE :search", { search: searchTerm })
            .orWhere("LOWER(client.email) LIKE :search", { search: searchTerm });
        }),
      );
    }

    const data = await query.getMany();
    return data;
  }

  async findClientPayments(clientId: number, pageOptionsDto: PageOptionsDto) {
    const [data, total] = await this.paymentRepo.findAndCount({
      relations: {
        client: true,
      },
      where: {
        client: {
          id: clientId
        }
      },
      order:{
        id: "DESC"
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    const pageMetaDto = new PageMetaDto({itemCount: total, pageOptionsDto})
    return new PageDto(data, pageMetaDto)
  }

  async exportClientPayments(clientId: number,) {
    const data = await this.paymentRepo.find({
      relations: {
        client: true,
      },
      where: {
        client: {
          id: clientId
        }
      },
      order:{
        id: "DESC"
      }
    });

    return data
  }

  async clientAttachments(id:number) {
    const attachments = await this.attachmentRepo.find({
      relations: {
        client: true,
      },
      where: {
        client: {
        id
        }
      }
    })
    
    const attachmentRes = attachments.map(attachment => new AttachmentResponseDto(attachment))
    const attachmentsResponse = await Promise.all(
      attachmentRes.map(async (attachment) => {
        attachment.imageUrl = await this.uploadService.getSignedUrl(attachment.name);
        return attachment;
      })
    )

    return attachmentsResponse
  }

  async findUserByEmail(email: string) {
    return await this.userRepo
      .createQueryBuilder("user")
      .addSelect("user.password")
      .leftJoinAndSelect("user.departments", "department")
      .where("user.email = :email", { email })
      .getOne();
  }

  async findUserById(id:number){
    return await this.userRepo.findOneBy({id})
  }

  async findClientByEmail(email: string) {
    return this.clientRepo
      .createQueryBuilder("client")
      .addSelect("client.password")
      .leftJoinAndSelect("client.membershipTier", "tier")
      .where("client.email = :email", { email })
      .andWhere("client.isDeleted = :deleted", {
        deleted: Deleted.FALSE,
      })
      .getOne();
  }

  async findClientById(id:number){
    return await this.clientRepo.findOneBy({id})
  }

  async findClientByShippingMark(id:string){
    return await this.clientRepo.findOne({where: {
      shippingMark: id
    }})
  }

  async updateUserPassword(id:number, password:string){
    await this.userRepo.update(id, {
      password
    })

    return await this.userRepo.findOneBy({id})
  }

  async updateClientPassword(id:number, password:string){
    await this.clientRepo.update(id, {
      password
    })

    return await this.clientRepo.findOneBy({id})
  }

  async findAllUsers() {
    return await this.userRepo.find()
  }

  async findShippingMarks(shippingMark?:string) {
    return await this.clientRepo.find({
      relations: {
        clientDetails: true
      },
      where: {
        ...(shippingMark && {shippingMark: Like(`%${shippingMark}%`)})
      }
    })
  }

  async clientProfile(id:number) {
    const client = await this.clientRepo.findOne({
      relations: {
        clientDetails: true,
        attachments:true
      },
      where: {
        id
      }
    })

    const clientResponse = new ClientResponseDto(client)
    clientResponse.attachments = await Promise.all(
      clientResponse.attachments.map(async (attachment) => {
        attachment.imageUrl = await this.uploadService.getSignedUrl(attachment.name);
        return attachment;
      })
    )

    return clientResponse
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, name?:string, email?:string) {
    await this.userRepo.update(id, {
      ...(name && { name }),
      ...(email && { email }),
    })
  
    return await this.userRepo.findOneBy({id});
  }

  async updateClient(
    id: number,
    shippingMark?: string,
    phone?: string,
    location?: string,
  ) {
    const client = await this.clientRepo.findOne({
      where: { id },
      relations: {
        clientDetails: true,
      },
    });

    if (!client) {
      throw new NotFoundException("Client not found");
    }

    if (shippingMark !== undefined) {
      client.shippingMark = shippingMark;
    }

    if (phone !== undefined) {
      client.phone = phone;
    }

    if (location !== undefined) {
      if (!client.clientDetails) {
        client.clientDetails = this.detailsRepo.create({ location });
      } else {
        client.clientDetails.location = location;
      }
    }

    await this.clientRepo.save(client);

    return client;
  }


  async updateClientDetails(id: number, clientInfo:ClientInfoUpdateRequest) {
    const client = await this.clientRepo.findOne({
      relations: {
        clientDetails: true
      },
      where: {
        id
      }
    })
    
    if (!client) {
      throw new Error(`Client with id ${id} not found.`);
    }

    // Initialize details if not set
    if (!client.clientDetails) {
      client.clientDetails = this.detailsRepo.create();
    }

    // Apply updates
    client.clientDetails.dob = clientInfo.dob ? new Date(clientInfo.dob) : null;
    client.clientDetails.location = clientInfo.location ?? null;
    client.clientDetails.nextOfKin = clientInfo.nextOfKin ?? null;
    client.clientDetails.nextOfKinPhone = clientInfo.nextOfKinPhone ?? null;

    return await this.clientRepo.save(client);
  }

  async updateClientApproval(id: number, clientApprovalUpdateRequest: ClientApprovalUpdateRequest) {
    return await this.clientRepo.update(id, {
      approvalStatus: clientApprovalUpdateRequest.approvalStatus
    })
  }

  async updatePayment(clientMark: string, userId: number, paymentId: number, paymentRequest: ClientPaymentRequest){
    const client = await this.findClientByShippingMark(clientMark)
    const user = await this.findUserById(userId)
    const payment = await this.paymentRepo.findOne({where: {id: paymentId}})
    if(!client) throw new NotFoundException(`Client with ID:${clientMark} does not exist.`)
    if(!user) throw new NotFoundException(`User is not permitted to make this request as you do not exist.`)
    if(!payment) throw new NotFoundException(`Payment with ID:${paymentId} does not exist.`)

    return this.paymentRepo.update(payment.id, {
      paidShippingRate: paymentRequest.paidShippingRate,
      ...(paymentRequest.paymentMethod && { paymentMethod: paymentRequest.paymentMethod }),
      ...(paymentRequest.reference && { reference: paymentRequest.reference }),
      ...(paymentRequest.datePaid && {datePaid: paymentRequest.datePaid}),
      client,
      user
    })
  }

  async resetClientPassword(id: number, password:string) {
    try{
      return await this.clientRepo.update(id, {
        password: await this.hashPassword(password)
      })
    }catch(err){
      throw err
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async removeClient(id: number) {
    try{
      return await this.clientRepo.delete(id )
    }catch(err){
      throw err
    }
  }

  async deleteAttachment(id: number, attachmentId: number){
    try{
      const attachment = await this.attachmentRepo.findOne({
        relations: {client: true},
        where: {
          id: attachmentId,
          client: {
            id
          }
        }
      })

      if(!attachment) throw new NotFoundException("Attachment not found")
      
      await this.attachmentRepo.remove(attachment);
      await this.uploadService.deleteAttachment(attachment.name)
      
      return {message: "attachment deleted successfully"}
    }catch(err){
      throw err
    }
  }

  async deletePayment(paymentId: number){
    return this.paymentRepo.delete(paymentId)
  }

  async evaluateMembershipTier(clientId: number, manager?: EntityManager) {
    const clientRepo = manager ? manager.getRepository(Client) : this.clientRepo;
    const tierRepo = manager ? manager.getRepository(MembershipTier) : this.tierRepo;

    const client = await clientRepo.findOne({
      where: { id: clientId },
      relations: ['membershipTier'],
    });

    if (!client) throw new NotFoundException("Client not found");

    const totalShipping = client.totalShippingRate;

    // Get all tiers sorted by priority descending
    const tiers = await tierRepo.find({
      order: { priority: 'DESC' },
    });
    
    // Find the highest tier that matches current totalShippingRate
    const matchingTier = tiers.find((tier) => totalShipping >= tier.minShipping);
    
    // Skip update if client is already at this tier
    if (matchingTier && client.membershipTier?.id === matchingTier.id) {
      return; // No change needed
    }

    const newTier = tiers.find((tier) => totalShipping >= tier.minShipping);

    if (newTier && client.membershipTier?.id !== newTier.id) {
      client.membershipTier = newTier;
      await clientRepo.save(client);
    }
  }

  async hashPassword(password:string){
    const hashedPassword = await hash(password, 10)
    return hashedPassword
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: 'daily-client-membership-evaluation' }) // every midnight
  async evaluteClientMembership() {
    const clients = await this.clientRepo.find({
      relations:{membershipTier: true},
      where: {
        isDeleted: Deleted.FALSE,
      },
    });

    await Promise.all(
      clients.map((client) =>
        this.evaluateMembershipTier(client.id)
      )
    );    
  }
}
