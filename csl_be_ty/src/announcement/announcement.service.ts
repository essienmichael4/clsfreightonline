import { Injectable } from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Announcement, Show } from './entities/announcement.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { ClientAnnouncement } from './entities/clientAnnouncement.entity';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement) private readonly announcementRepo:Repository<Announcement>, 
    @InjectRepository(ClientAnnouncement) private readonly clientAnnouncementRepo:Repository<ClientAnnouncement>, 
    private userService: UserService,
  ){}

  async create(createAnnouncementDto: CreateAnnouncementDto) {
    const user = await this.userService.findUserById(createAnnouncementDto.updatedBy)

    const announcement = this.announcementRepo.create({
      ...(createAnnouncementDto.title && { title: createAnnouncementDto.title }), 
      body: createAnnouncementDto.subject,
      updatedBy:  user || undefined,
      show: Show.FALSE,
    });

    return await this.announcementRepo.save(announcement)
  }

  async createForClient(createAnnouncementDto: CreateAnnouncementDto) {
    const user = await this.userService.findUserById(createAnnouncementDto.updatedBy)

    const announcement = this.clientAnnouncementRepo.create({
      ...(createAnnouncementDto.title && { title: createAnnouncementDto.title }), 
      body: createAnnouncementDto.subject,
      updatedBy:  user || undefined,
      show: Show.FALSE,
    });

    return await this.clientAnnouncementRepo.save(announcement)
  }

  async findOne() {
    return await this.announcementRepo.findOneBy({id:1});
  }

  async findOneForClient() {
    return await this.clientAnnouncementRepo.findOneBy({id:1});
  }

  async update(id: number, updatedBy:number, subject:string, title?:string)  {
    const user = await this.userService.findUserById(updatedBy)

    await this.announcementRepo.update(id, {
      ...(title && { title: title }), 
      body: subject,
      updatedBy:  user || undefined
    });

    return await this.announcementRepo.findOneBy({id:1})
  }

  async updateClientAnnouncement(id: number, updatedBy:number, subject:string, title?:string)  {
    const user = await this.userService.findUserById(updatedBy)

    await this.clientAnnouncementRepo.update(id, {
      ...(title && { title: title }), 
      body: subject,
      updatedBy:  user || undefined
    });

    return await this.clientAnnouncementRepo.findOneBy({id:1})
  }

  async updateStatus(id: number, updatedBy:number, show:Show)  {
    const user = await this.userService.findUserById(updatedBy)

    await this.announcementRepo.update(id, {
      show,
      updatedBy:  user || undefined
    });

    return await this.announcementRepo.findOneBy({id:1})
  }

  async updateStatusForClient(id: number, updatedBy:number, show:Show)  {
    const user = await this.userService.findUserById(updatedBy)

    await this.clientAnnouncementRepo.update(id, {
      show,
      updatedBy:  user || undefined
    });

    return await this.clientAnnouncementRepo.findOneBy({id:1})
  }

}
