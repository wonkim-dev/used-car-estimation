import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guards';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { User } from '../users/users.entity';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { ReportDto } from './dtos/report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }
}
