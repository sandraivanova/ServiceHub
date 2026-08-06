import {Injectable} from "@nestjs/common";
import {JwtService} from '@nestjs/jwt';
import {User} from "../../../models";
import {encryptPassword} from "../../../webhooks/utils/encrypt-password.utils";

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async validateUser(email: string, pass: string) {
        const user=await User.findOne({where: {email}});
        if (!user){
            return null;
        }

        const hashPassword=await encryptPassword(pass);
        if (user.password === hashPassword){
            const { password, ...result } = user.get({ plain: true });
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };

        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET || 'access-secret-key',
            expiresIn: '15m',
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
            expiresIn: '7d',
        });

        return {
            accessToken,
            refreshToken,
            user,
        };
    }
}