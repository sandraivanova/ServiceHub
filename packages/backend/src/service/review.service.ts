import {IReview} from "../../../shared/models/review";
import {GivingService, Review, User} from "../../../models";
import {NotFoundException} from "@nestjs/common";

export class ReviewService {
    constructor() {}

    async create(reviewData: IReview,user_id: number) {
        reviewData.userId=user_id;
        return await Review.create(reviewData);
    }

    async findOneByPk(id: number) {
        const review = await Review.findByPk(id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: GivingService
                }
            ]
        });

        if (!review) {
            throw new NotFoundException('Рецензијата не постои.');
        }

        return review;
    }

    async findAllForService(serviceId: number) {
        const service = await GivingService.findByPk(serviceId);
        if (!service) {
            throw new NotFoundException('Услугата не постои.');
        }

        return await Review.findAll({
            where: { serviceId },
            include: [{
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }],
            order: [['createdAt', 'DESC']]
        });
    }

    async remove(id: number) {
        const review = await this.findOneByPk(id);
        await review.destroy();
        return { message: 'Успешно избришана рецензија.' };
    }

    async update(id: number, reviewData: IReview) {
        const review = await this.findOneByPk(id);

        await review.update(reviewData);
        return review;
    }

}