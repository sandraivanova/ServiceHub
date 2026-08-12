import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GivingServicesService } from '../service/giving.service';
import {CurrentProfile} from "../middleware/decorators/currentProfile.decorator";
import {User} from "../../../models";
import { IGivingService } from "../../../shared/models";

@Controller('giving-services')
export class GivingServicesController {
    constructor(private readonly givingServicesService: GivingServicesService) {}

    @Post()
    async create(@Body() body: IGivingService,@CurrentProfile() user: User) {
        return await this.givingServicesService.create(body, user.id);
    }

    @Get()
    async findAll() {
        return await this.givingServicesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return await this.givingServicesService.findOneByPk(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() body: IGivingService
    ) {
        return await this.givingServicesService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return await this.givingServicesService.remove(id);
    }
}