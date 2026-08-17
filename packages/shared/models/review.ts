import {DbModel} from "./db.model";
import {IUser} from "./user";
import {IGivingService} from "./giving_service";

export interface IReview extends DbModel {
    rating: number;
    description?: string;
    userId: number;
    serviceId: number;
    user: IUser;
    service: IGivingService
}