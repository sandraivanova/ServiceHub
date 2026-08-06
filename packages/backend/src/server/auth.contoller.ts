import {BadRequestException, Body, Controller, HttpCode, Post, Req, UnauthorizedException,} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {Request} from 'express';
import {encryptPassword} from "../../../webhooks/utils/encrypt-password.utils";
import {UsersService} from "../service/user.service";
import {IUser} from "../../../shared/models/user"

const JWT_SECRET = process.env.JWT_SECRET || 'access-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret-key';

@Controller('auth')
export class AuthController {

    constructor(private readonly userService: UsersService) {
    }

    @Post('login')
    @HttpCode(200)
    async login(@Req() req: Request, @Body() body: {email: string, password:string}) {
        const {email, password} = body;

        if (!email || !password) {
            throw new UnauthorizedException({error: 'empty email or password'});
        }

        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('email/password did not match');
        }

        const hashedPassword = await encryptPassword(password);
        if (user.password !== hashedPassword) {
            throw new UnauthorizedException('email/password did not match');
        }

        const session = getSessionForEmail(user.email, user.id);
        return {
            ...session,
            firstName: user.firstName,
            lastName: user.lastName
        };    }

    @Post('logout')
    @HttpCode(200)
    async logout(@Req() req: Request) {
        // todo testeing source then remove
        const {refreshToken} = req.body;
        if (!refreshToken) {
            throw new UnauthorizedException();
        }

        try {
            jwt.verify(refreshToken, REFRESH_SECRET);
            return {message: 'Logged out successfully'};
        } catch (err) {
            throw new UnauthorizedException();
        }
    }

    @Post('token')
    @HttpCode(200)
    async refreshToken(@Req() req: Request) {
        const {refreshToken} = req.body;
        if (!refreshToken) {
            throw new UnauthorizedException();
        }

        try {
            const decoded: any = jwt.verify(refreshToken, REFRESH_SECRET);
            const user = await this.userService.findByEmail(decoded);

            if (!user) {
                throw new UnauthorizedException();
            }

            return getSessionForEmail(user.email, user.id);
        } catch (e) {
            throw new UnauthorizedException();
        }
    }

    @Post('sign-up')
    @HttpCode(200)
    async signUp(@Req() req: Request) {
        const user = req.body as IUser;

        if (!user.email || !user.password || !user.firstName || !user.lastName) {
            throw new BadRequestException({message: 'Some fields are missing'});
        }

        const existingUser = await this.userService.findByEmail(user.email);
        if (existingUser) {
            throw new BadRequestException({message: 'Email already exists'});
        }

        user.password = await encryptPassword(user.password);

        await this.userService.create(user);

        return {message: 'Sign up successful'};
    }
}

export function getSessionForEmail(userEmail: string, userId: number) {
    const payload = {email: userEmail, sub: userId, loggedIn: new Date()};

    const accessToken = jwt.sign(payload, JWT_SECRET, {expiresIn: '15m'});
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {expiresIn: '7d'});

    return {
        accessToken,
        refreshToken,
    };
}