import { Model } from 'sequelize-typescript';
export declare class User extends Model<User> {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
