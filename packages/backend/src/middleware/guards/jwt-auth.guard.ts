import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";

/**
 * CurrentUserFromJwtMiddleware silently leaves req.user unset for a missing,
 * expired, or otherwise invalid access token instead of rejecting the request.
 * Routes that require a logged-in user must use this guard so an expired
 * token surfaces as a 401 (which the frontend interceptor uses to trigger a
 * token refresh) instead of a 500 (from code assuming req.user exists) or a
 * silent 200 with no user data.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        if (!request.user) {
            throw new UnauthorizedException();
        }

        return true;
    }
}
