import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {SequelizeModule} from '@nestjs/sequelize';
import {ConfigModule} from "@nestjs/config";
import {UsersService} from "./service/user.service";
import {UserController} from "./server/user.controller";
import {User} from "../../models";
import {AuthController} from "./server/auth.contoller";

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
        })
    ],
    controllers: [AppController,UserController, AuthController],
    providers: [AppService,UsersService],
})
export class AppModule {
}
