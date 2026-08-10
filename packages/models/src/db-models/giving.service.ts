import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import User from "./user";

export enum PriceUnit {
    HOUR = 'hour',
    PROJECT = 'project',
    SQUARE_METER = 'square_meter',
    DAY = 'day',
}

export enum ServiceCategory {
    ELECTRICIAN = 'electrician',
    PLUMBER = 'plumber',
    CLEANING = 'cleaning',
    PAINTING = 'painting',
    CARPENTRY = 'carpentry',
    OTHER = 'other',
}

@Table({ tableName: 'giving_services', timestamps: true })
export default class GivingService extends Model<GivingService>{

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare providerId: number;

    @BelongsTo(() => User)
    declare provider: User;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare title: string;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    declare priceFrom: number;

    @Column({
        type: DataType.ENUM(...Object.values(PriceUnit)),
        allowNull: false
    })
    declare priceUnit: PriceUnit;

    @Column({
        type: DataType.ENUM(...Object.values(ServiceCategory)),
        allowNull: false
    })
    declare category: ServiceCategory;

    @Column({
        type:DataType.STRING,
        allowNull: false
    })
    declare location: string;

    @Column({
        type:DataType.STRING,
        allowNull: false
    })
    declare description: string;

    @Column({
        type: DataType.NUMBER,
        allowNull: true

    })
    declare yearsOfExperience: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: true,
        defaultValue: 0,
    })
    declare rating: number;

    @Column({
        type: DataType.NUMBER
    })
    declare bookingCount: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare imageUrl: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare phone: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare availability: string;

}