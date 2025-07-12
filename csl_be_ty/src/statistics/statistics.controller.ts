import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @UseGuards(JwtGuard)
  @Get("client-dashboard")
  clientDashboardStatistics(@User() user:UserInfo, @Query("state") currency?:"USD"|"GHS",  @Query("from") from?:string, @Query("to") to?:string) {  
    return this.statisticsService.clientDashboardStatistics(from, to, currency, user.sub.id)
  }
}
