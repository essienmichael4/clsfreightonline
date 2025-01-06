import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { Show } from './entities/announcement.entity';

interface AnnouncementUpdateRequest{
  title?:string,
  subject:string
}

interface ShowUpdateRequest{
  show:Show
}

@Controller('announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() body: AnnouncementUpdateRequest,  @User() user:UserInfo) {
    return this.announcementService.create({updatedBy: user.sub.id, subject: body.subject, title:body.title});
  }

  // @UseGuards(JwtGuard)
  @Get()
  find() {
    return this.announcementService.findOne();
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: AnnouncementUpdateRequest,  @User() user:UserInfo) {
    return this.announcementService.update(id, user.sub.id, body.subject, body.title);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/show')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: ShowUpdateRequest,  @User() user:UserInfo) {
    return this.announcementService.updateStatus(id, user.sub.id, body.show);
  }
}
