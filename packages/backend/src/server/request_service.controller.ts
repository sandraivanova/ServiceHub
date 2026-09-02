import {Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards} from '@nestjs/common';
import {CurrentProfile} from "../middleware/decorators/currentProfile.decorator";
import {JwtAuthGuard} from "../middleware/guards/jwt-auth.guard";
import {User} from "../../../models";
import {IRequestService} from "@dnevnica/shared/models/request_service";
import {RequestServiceService} from "../service/request_service.service";

@Controller('request-service')
export class RequestServiceController {
    constructor(private readonly serviceRequestService: RequestServiceService) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() body: IRequestService, @CurrentProfile() user: User) {
        return await this.serviceRequestService.create(body, user.id);
    }

    @Get()
    async findAll(
        @Query('search') title?: string,
        @Query('category') category?: string,
        @Query('location') location?: string,
    ) {
        return await this.serviceRequestService.findAll({title, category, location});
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return await this.serviceRequestService.findOneByPk(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() body: IRequestService
    ) {
        return await this.serviceRequestService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return await this.serviceRequestService.remove(id);
    }
}