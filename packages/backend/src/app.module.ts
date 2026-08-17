import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {SequelizeModule} from '@nestjs/sequelize';
import {ConfigModule} from "@nestjs/config";
import {UsersService} from "./service/user.service";
import {UserController} from "./server/user.controller";
import {GivingService, Review, User} from "../../models";
import {AuthController} from "./server/auth.contoller";
import {AuthService} from "./service/auth.service";
import {CurrentUserFromJwtMiddleware} from "./middleware/CurrentUserFromJwtMiddleware";
import {GivingServicesController} from "./server/giving_service.controller";
import {GivingServicesService} from "./service/giving.service";
import {ReviewController} from "./server/review.controller";
import {ReviewService} from "./service/review.service";

const CONTROLLERS = [
    AppController,
    UserController,
    AuthController,
    GivingServicesController,
    ReviewController
]

const MODELS = [
    User,
    GivingService,
    Review
]

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        SequelizeModule.forRoot({
            dialect: 'mysql',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT!,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            models: MODELS,
            autoLoadModels: true,
            synchronize: false,
        }),
        SequelizeModule.forFeature(MODELS),
        JwtModule.register({
            secret: process.env['JWT_ACCESS_SECRET'] || 'access-secret-key',
            signOptions: {expiresIn: '15m'},
        }),
    ],
    controllers: [...CONTROLLERS],
    providers: [AppService, UsersService, AuthService, GivingServicesService,ReviewService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CurrentUserFromJwtMiddleware).forRoutes(...CONTROLLERS);
    }

}
