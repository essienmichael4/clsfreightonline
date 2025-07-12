import { Injectable } from '@nestjs/common';
import { CreateClientDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { hash } from 'bcryptjs';
import { ClientInfoUpdateRequest } from './dto/updateUser.dto';
import { Details } from './entities/details.entity';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    @InjectRepository(Client) private readonly clientRepo:Repository<Client>,
    @InjectRepository(Details) private readonly detailsRepo:Repository<Details>,
  ){}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto)
    return await this.userRepo.save(user)
  }

  async createClient(createUserDto: CreateClientDto) {
    const user = this.clientRepo.create(createUserDto)
    return await this.clientRepo.save(user)
  }

  async findClients(pageOptionsDto:PageOptionsDto, search?:string){
    const query = this.clientRepo.createQueryBuilder("client");

    if (search) {
      query.where("client.shippingMark ILIKE :search", { search: `%${search}%` })
          .orWhere("client.email ILIKE :search", { search: `%${search}%` });
    }

    if (pageOptionsDto.skip !== undefined && pageOptionsDto.take !== undefined) {
      query.skip(pageOptionsDto.skip).take(pageOptionsDto.take);
    }

    const clientsCount = await this.clientRepo.count()

    const clients = await query.getMany();
    const pageMetaDto = new PageMetaDto({itemCount: clientsCount, pageOptionsDto})
    return new PageDto(clients, pageMetaDto)
  }

  async findUserByEmail(email:string){
    return await this.userRepo.findOneBy({email})
  }

  async findUserById(id:number){
    return await this.userRepo.findOneBy({id})
  }

  async findClientByEmail(email:string){
    return await this.clientRepo.findOneBy({email})
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
    return await this.clientRepo.findOne({
      relations: {
        clientDetails: true
      },
      where: {
        id
      }
    })
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

  async hashPassword(password:string){
    const hashedPassword = await hash(password, 10)
    return hashedPassword
  }
}
