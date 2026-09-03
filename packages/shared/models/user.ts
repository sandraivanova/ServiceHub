import {DbModel} from "./db.model";
import {IReview} from "./review";

export interface IUser extends DbModel {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isEmailVerified?: boolean;
    reviews?: IReview[];
    resetPasswordExpires?: Date;
    resetPasswordToken?: string;
}