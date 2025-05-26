import { Injectable } from '@nestjs/common';
import { CreateLoadingDto } from './dto/create-loading.dto';
import { Loading, Status } from './entities/loading.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LoadingService {
  constructor(@InjectRepository(Loading) private readonly loadingRepo:Repository<Loading>){}

  async create(createLoadingDto: CreateLoadingDto) {
    const loading = this.loadingRepo.create(createLoadingDto)
    return await this.loadingRepo.save(loading)
  }

  async findAll() {
    return await this.loadingRepo.find()
  }

  async findAllByStatus( status:Status) {
    return await this.loadingRepo.find({
      where: {
        status
      }
    })
  }

  async findOne(id: number) {
    return await this.loadingRepo.findBy({id})
  }

  async update(id: number, addedBy:number, vessel?: string, eta?: string, loaded?: string, status?:Status, description?:string) {
    return await this.loadingRepo.update(id, {
      ...(vessel && { vessel }),
      ...(eta && { eta }),
      ...(loaded && { loaded }),
      ...(status && { status }),
      description : description || "",
    });
  }

  async updateStatus(id: number, status: Status) {
      return await this.loadingRepo.update(id, {
        status
      });
    }

  async remove(id: number) {
    return await this.loadingRepo.delete(id)
  }
}
