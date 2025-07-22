import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityManager, Like, Repository } from 'typeorm';
import { Client, Deleted } from './entities/client.entity';
import { hash } from 'bcryptjs';
import { ClientInfoUpdateRequest } from './dto/updateUser.dto';
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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    @InjectRepository(Client) private readonly clientRepo:Repository<Client>,
    @InjectRepository(Details) private readonly detailsRepo:Repository<Details>,
    @InjectRepository(Attachment) private readonly attachmentRepo:Repository<Attachment>,
    @InjectRepository(MembershipTier) private readonly tierRepo:Repository<MembershipTier>,
    private readonly uploadService: UploadService,
  ){}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto)
    return await this.userRepo.save(user)
  }

  async createMembershipTier(createMembershipTierDto: CreateMembershipTierDto) {
    const tier = this.tierRepo.create(createMembershipTierDto)
    return await this.tierRepo.save(tier)
  }

  async createClient(createUserDto: CreateClientDto) {
    const user = this.clientRepo.create(createUserDto)
    return await this.clientRepo.save(user)
  }

  async addAttachment(id: number, attachment: string){
    const client = await this.findClientById(id)

    return await this.attachmentRepo.save({
      name: attachment,
      client
    })
  }

  async findClients(pageOptionsDto:PageOptionsDto, search?:string){
    const query = this.clientRepo.createQueryBuilder("client");

    if (search) {
      query.where("client.shippingMark LIKE :search", { search: `%${search}%` })
          .orWhere("client.email LIKE :search", { search: `%${search}%` });
    }

    if (pageOptionsDto.skip !== undefined && pageOptionsDto.take !== undefined) {
      query.skip(pageOptionsDto.skip).take(pageOptionsDto.take);
    }

    const clientsCount = await this.clientRepo.count()

    const clients = await query.getMany();
    const pageMetaDto = new PageMetaDto({itemCount: clientsCount, pageOptionsDto})
    return new PageDto(clients, pageMetaDto)
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

  async findUserByEmail(email:string){
    return await this.userRepo.findOneBy({email})
  }

  async findUserById(id:number){
    return await this.userRepo.findOneBy({id})
  }

  async findClientByEmail(email:string){
    return await this.clientRepo.findOne({
      relations: {membershipTier: true},
      where: {email}
    })
  }

  async findClientById(id:number){
    return await this.clientRepo.findOneBy({id})
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

  async updateClient(id: number, shippingMark?:string, phone?:string) {
    await this.clientRepo.update(id, {
      ...(shippingMark && { shippingMark }),
      ...(phone && { phone }),
    })
  
    return await this.clientRepo.findOneBy({id});
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

      if(!attachment) throw new Error("Attachment not found")
      
      await this.attachmentRepo.delete(id)
      await this.uploadService.deleteAttachment(attachment.name)
      return {message: "attachment deleted successfully"}
    }catch(err){
      throw err
    }
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
    // console.log(tiers)
    
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
