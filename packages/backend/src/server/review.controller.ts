import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put} from "@nestjs/common";
import {ReviewService} from "../service/review.service";
import {CurrentProfile} from "../middleware/decorators/currentProfile.decorator";
import {GivingService, User} from "../../../models";
import {IReview} from "../../../shared/models";

@Controller('giving-services')
export class GivingServicesController {
    constructor(private readonly reviewService: ReviewService) {
    }

    @Post()
    async create(@Body() body: IReview, @CurrentProfile() user: User) {
        return await this.reviewService.create(body, user.id);
    }

    @Get(':serviceId')
    async findAllForService(@Param('serviceId') serviceId: number) {
        const service = await GivingService.findByPk(serviceId);
        if (!service) {
            throw new NotFoundException('Услугата не постои.');
        }

        return await this.reviewService.findAllForService(serviceId)
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return await this.reviewService.remove(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() body: IReview
    ) {
        return await this.reviewService.update(id, body);
    }
}