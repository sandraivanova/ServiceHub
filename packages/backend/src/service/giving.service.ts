import { Injectable, NotFoundException } from "@nestjs/common";
import  GivingService from "../../../models/src/db-models/giving.service";
import { IGivingService } from "../../../shared/models";

@Injectable()
export class GivingServicesService {
    constructor() {}

    async create(serviceData: IGivingService, user_id: number) {
        return await GivingService.create({
            ...serviceData,
            providerId: user_id
        } as any);
    }

    async findAll() {
        return await GivingService.findAll({
            include: ['provider']
        });
    }

    async findOneByPk(id: number) {
        const service = await GivingService.findByPk(id, {
            include: ['provider']
        });
        if (!service) {
            throw new NotFoundException('Услугата не постои.');
        }
        return service;
    }

    async update(id: number, serviceData: IGivingService) {
        const service = await this.findOneByPk(id);

        await service.update(serviceData);
        return service;
    }

    async remove(id: number) {
        const service = await this.findOneByPk(id);
        await service.destroy();
        return { message: 'Успешно избришана услуга.' };
    }
}