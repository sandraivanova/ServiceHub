import {Column, CreatedAt, DataType, HasMany, Model, Table, UpdatedAt} from 'sequelize-typescript';
import {IUser} from "../../../shared/models";
import Review from "./review";

@Table({
    tableName: 'user',
    charset: 'utf8mb4'
})
export default class User extends Model<IUser> {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare firstName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare lastName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    declare isEmailVerified: boolean;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare createdAt: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare updatedAt: Date;

    @HasMany(() => Review)
    declare reviews: Review[];
}