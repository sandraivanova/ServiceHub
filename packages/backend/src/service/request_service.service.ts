import {Injectable, NotFoundException} from "@nestjs/common";
import {Op} from "sequelize";
import {User} from "../../../models";
import {IRequestService} from "@dnevnica/shared/models/request_service";
import RequestService from "models/src/db-models/request-service";

@Injectable()
export class RequestServiceService {
    constructor() {
    }

    async create(serviceData: IRequestService, user_id: number) {
        serviceData.clientId = user_id
        return await RequestService.create(serviceData);
    }

    async findAll(filters?: { title?: string; category?: string; location?: string }) {
        const where: any = {};

        if (filters?.category) {
            where.category = filters.category;
        }

        if (filters?.location) {
            where.location = filters.location;
        }

        if (filters?.title) {
            where.title = {[Op.like]: `%${filters.title}%`};
        }

        return await RequestService.findAll({
            where,
            include: [{
                model: User,
                as: 'client'
            }]
        });
    }

    async findOneByPk(id: number) {
        const service = await RequestService.findByPk(id, {
            include: [{
                model: User,
                as: 'client'
            }]
        });
        if (!service) {
            throw new NotFoundException('Услугата не постои.');
        }
        return service;
    }

    async update(id: number, serviceData: IRequestService) {
        const service = await this.findOneByPk(id);

        await service.update(serviceData);
        return service;
    }

    async remove(id: number) {
        const service = await this.findOneByPk(id);
        await service.destroy();
        return {message: 'Успешно избришана услуга.'};
    }
}