import {IReview} from "../../../shared/models";
import {GivingService, Review, User} from "../../../models";
import {Injectable, NotFoundException} from "@nestjs/common";

@Injectable()
export class ReviewService {
    constructor() {
    }

    async create(reviewData: IReview, user_id: number) {
        reviewData.userId = user_id;
        const existingReview = await Review.findOne({
            where: {userId: user_id, serviceId: reviewData.serviceId}
        });
        if (existingReview) {
            return await this.update(existingReview.id, reviewData);
        }
        return await Review.create(reviewData);
    }

    async findOneByPk(id: number) {
        const review = await Review.findByPk(id, {
            include: [User, GivingService]
        });

        if (!review) {
            throw new NotFoundException('Рецензијата не постои.');
        }

        return review;
    }

    async findAllReviewsForService (serviceId: number) {
        const service = await GivingService.findByPk(serviceId);
        if (!service) {
            throw new NotFoundException('Услугата не постои.');
        }

        return await Review.findAll({
            where: {serviceId:serviceId},
            include: [{
                model: User,
            }],
            order: [['createdAt', 'DESC']]
        });
    }

    async remove(id: number) {
        const review = await this.findOneByPk(id);
        await review.destroy();
        return {message: 'Успешно избришана рецензија.'};
    }

    async update(id: number, reviewData: IReview) {
        const review = await this.findOneByPk(id);

        await review.update(reviewData);
        return review;
    }

    async findUserReviewForService(serviceId: number, userId: number) {
        return await Review.findOne({
            where: {serviceId:serviceId, userId:userId}
        });
    }

}