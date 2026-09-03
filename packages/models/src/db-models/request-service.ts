import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
    UpdatedAt
} from "sequelize-typescript";
import User from "./user";
import {Location, PriceUnit, ServiceCategory, Urgency} from "../../../shared/models";
import {
    IRequestService,
    ServiceMode,
    TIME_PREFERENCE_LABELS,
    TimePreference
} from "@dnevnica/shared/models/request_service";

@Table({ tableName: 'request-service', timestamps: true })
export default class RequestService extends Model<IRequestService>{

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare title: string;

    @Column({
        type: DataType.NUMBER,
        allowNull: true,
    })
    declare price: number;

    @Column({
        type: DataType.ENUM(...Object.values(PriceUnit)),
        allowNull: true
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
    declare location: Location;

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
        type: DataType.ENUM(...Object.values(Urgency)),
        allowNull: false
    })
    declare urgency: Urgency;

    @Column({
        type: DataType.ENUM(...Object.values(ServiceMode)),
        allowNull: false
    })
    declare serviceMode: ServiceMode;

    @Column({
        type: DataType.ENUM(...Object.values(TimePreference)),
        allowNull: true
    })
    declare timePreference: TimePreference;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    declare deadline: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    duration: string; //2casa, 3 dena,...

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
    declare clientId: number;

    @BelongsTo(() => User)
    declare client: User;


}