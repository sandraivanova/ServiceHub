import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db')
  getDBConnectionCheck() {
    return "The DB is connected"
  }

  @Get('test')
  getTestData(){
    return {message: 'Uspesno povrzano so nestjs bekend!'}
  }
}
