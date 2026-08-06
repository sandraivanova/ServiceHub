import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {User} from "../../../../models";

export const CurrentProfile = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): User | undefined => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);