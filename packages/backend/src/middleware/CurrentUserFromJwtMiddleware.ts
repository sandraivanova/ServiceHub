import {Injectable, NestMiddleware} from "@nestjs/common";
import {verify} from "jsonwebtoken";
import {Request} from "express";
import {User} from "../../../models";

@Injectable()
export class CurrentUserFromJwtMiddleware implements NestMiddleware {
    async use(req: any, res: any, next: (error?: any) => void) {
        const token = await this.getValidBearerToken(req);
        if (token) {
            const payload = this.getPayload(token);
            if (!payload?.id) {
                next();
                return;
            }
            req.user = await User.findOne({where: {email: payload.email}});
        }

        next();
        return;
    }

    protected async getValidBearerToken(req: Request): Promise<string | undefined> {
        const token = this.getBearerToken(req);
        if (!token) {
            return undefined;
        }
        return token;
    }

    protected getBearerToken(req: Request): string | undefined {
        // console.log(req.headers.authorization)
        const authorization = req.headers.authorization;

        if (!authorization?.startsWith('Bearer ')) {
            return undefined;
        }

        return authorization.slice(7);
    }

    protected getPayload(token: string) {
        const jwtSecret = process.env.JWT_SECRET || 'access-secret-key';

        try {
            const payload = verify(token, jwtSecret);
            if (typeof payload === 'string' || !payload?.id) {
                return undefined;
            }

            return payload;
        } catch {
            return undefined;
        }
    }

}