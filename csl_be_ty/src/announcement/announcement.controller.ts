import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
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

  @UseGuards(JwtGuard)
  @Post("clients")
  createForClient(@Body() body: AnnouncementUpdateRequest,  @User() user:UserInfo) {
    return this.announcementService.createForClient({updatedBy: user.sub.id, subject: body.subject, title:body.title});
  }

  // @UseGuards(JwtGuard)
  @Get()
  find() {
    return this.announcementService.findOne();
  }

  // @UseGuards(JwtGuard)
  @Get("clients")
  findForClient() {
    return this.announcementService.findOneForClient();
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: AnnouncementUpdateRequest,  @User() user:UserInfo) {
    return this.announcementService.update(id, user.sub.id, body.subject, body.title);
  }

  @UseGuards(JwtGuard)
  @Patch('clients/:id')
  updateClientAnnouncement(@Param('id', ParseIntPipe) id: number, @Body() body: AnnouncementUpdateRequest,  @User() user:UserInfo) {
    return this.announcementService.updateClientAnnouncement(id, user.sub.id, body.subject, body.title);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/show')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: ShowUpdateRequest,  @User() user:UserInfo) {
    return this.announcementService.updateStatus(id, user.sub.id, body.show);
  }

  @UseGuards(JwtGuard)
  @Patch('clients/:id/show')
  updateStatusForClientAnnoment(@Param('id', ParseIntPipe) id: number, @Body() body: ShowUpdateRequest,  @User() user:UserInfo) {
    return this.announcementService.updateStatusForClient(id, user.sub.id, body.show);
  }
}
