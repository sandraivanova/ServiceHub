import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {UsersService} from "../service/user.service";
import {IUser} from "../../../shared/models/user"


@Controller('users')
export class UserController {
    constructor(private readonly userService: UsersService) {
    }

    @Post()
    async create(@Body() userData: IUser) {
        return this.userService.create(userData)
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