import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {SequelizeModule} from '@nestjs/sequelize';
import {ConfigModule} from "@nestjs/config";
import {UsersService} from "./service/user.service";
import {UserController} from "./server/user.controller";
import {User} from "../../models";
import {AuthController} from "./server/auth.contoller";
import {AuthService} from "./service/auth.service";
import {CurrentUserFromJwtMiddleware} from "./middleware/CurrentUserFromJwtMiddleware";

const CONTROLLERS = [
    AppController,
    UserController,
    AuthController
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
            models: [User],
            autoLoadModels: true,
            synchronize: false,
        }),
        JwtModule.register({
            secret: process.env['JWT_ACCESS_SECRET'] || 'access-secret-key',
            signOptions: { expiresIn: '15m' },
        }),
    ],
    controllers: [...CONTROLLERS],
    providers: [AppService,UsersService,AuthService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CurrentUserFromJwtMiddleware).forRoutes(...CONTROLLERS);
    }

}
