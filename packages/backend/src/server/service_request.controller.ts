import {Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards} from '@nestjs/common';
import {CurrentProfile} from "../middleware/decorators/currentProfile.decorator";
import {JwtAuthGuard} from "../middleware/guards/jwt-auth.guard";
import {User} from "../../../models";
import {IServiceRequest} from "@dnevnica/shared/models/service_request";
import {ServiceRequestService} from "../service/service_request.service";

@Controller('service-request')
export class ServiceRequestController {
    constructor(private readonly serviceRequestService: ServiceRequestService) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() body: IServiceRequest, @CurrentProfile() user: User) {
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
        @Body() body: IServiceRequest
    ) {
        return await this.serviceRequestService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return await this.serviceRequestService.remove(id);
    }
}