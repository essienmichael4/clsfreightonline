import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo:Repository<User>){}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto)
    return await this.userRepo.save(user)
  }

  async findUserByEmail(email:string){
    return await this.userRepo.findOneBy({email})
  }

  async findUserById(id:number){
    return await this.userRepo.findOneBy({id})
  }

  async updateUserPassword(id:number, password:string){
    await this.userRepo.update(id, {
      password
    })

    return await this.userRepo.findOneBy({id})
  }

  async findAllUsers() {
    return await this.userRepo.find()
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
