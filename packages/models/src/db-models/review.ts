import {BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt} from "sequelize-typescript";
import User from "./user";
import {IReview} from "../../../shared/models";
import GivingService from "./giving-service";

@Table({tableName: 'review', timestamps: true})
export default class Review extends Model<IReview> {

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare rating: number;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    declare description: string;

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

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare userId: number;

    @ForeignKey(() => GivingService)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare serviceId: number;

    @BelongsTo(() => User)
    declare user: User;

    @BelongsTo(() => GivingService)
    declare service: GivingService;
}