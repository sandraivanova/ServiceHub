import {Injectable, NotFoundException} from "@nestjs/common";
import {Op} from "sequelize";
import {User} from "../../../models";
import {IServiceRequest} from "@dnevnica/shared/models/service_request";
import ServiceRequest from "models/src/db-models/service-request";

@Injectable()
export class ServiceRequestService {
    constructor() {
    }

    async create(serviceData: IServiceRequest, user_id: number) {
        serviceData.clientId = user_id
        return await ServiceRequest.create(serviceData);
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

        return await ServiceRequest.findAll({
            where,
            include: [{
                model: User,
                as: 'client'
            }]
        });
    }

    async findOneByPk(id: number) {
        const service = await ServiceRequest.findByPk(id, {
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

    async update(id: number, serviceData: IServiceRequest) {
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