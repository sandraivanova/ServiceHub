import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    UnauthorizedException,
    UseGuards
} from "@nestjs/common";
import {UsersService} from "../service/user.service";
import {IUser} from "../../../shared/models";
import {CurrentProfile} from "../middleware/decorators/currentProfile.decorator";
import {JwtAuthGuard} from "../middleware/guards/jwt-auth.guard";
import {User} from "../../../models";
import {EmailService} from "../bullmq/queues/EmailService";


@Controller('users')
export class UserController {
    constructor(private readonly userService: UsersService,
                private readonly emailService: EmailService) {
    }

    @Get('current-user')
    @UseGuards(JwtAuthGuard)
    async getCurrentUser(@CurrentProfile() user: User) {
        return user;
    }

    @Post()
    async create(@Body() userData: IUser) {
        let user = await this.userService.create(userData);
        if (!user) {
            throw new NotFoundException();
        }
        await this.emailService.sendWelcomeEmail(user.email, user.firstName)
        return user;
    }

    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOneByPk(@Param('id') id: number) {
        return this.userService.findOneByPk(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() userData: Partial<IUser>
    ) {
        return this.userService.update(id, userData);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.userService.remove(id);
    }

}