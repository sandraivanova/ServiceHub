import {DbModel} from "./db.model";

export interface IUser extends DbModel {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isEmailVerified?: boolean;
}