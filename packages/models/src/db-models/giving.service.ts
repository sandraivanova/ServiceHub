import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import User from "./user";
import {Location, PriceUnit, ServiceCategory} from "../../../shared/models";

@Table({ tableName: 'giving_service', timestamps: true })
export default class GivingService extends Model<GivingService>{

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare providerId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare title: string;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    declare price: number;

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
        type: DataType.ENUM(...Object.values(Location)),
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

    @BelongsTo(() => User)
    declare provider: User;

}