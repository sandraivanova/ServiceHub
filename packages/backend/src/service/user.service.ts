import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {User} from "../../../models";
import {IUser} from "@dnevnica/shared/models";
import {Queue} from "bullmq";
import {InjectQueue} from "@nestjs/bullmq";

@Injectable()
export class UsersService {
    constructor(
        @InjectQueue('email-queue') private readonly emailQueue: Queue
    ) {
    }

    async create(userData: IUser) {
        const existingUser = await this.findByEmail(userData.email);
        if (existingUser) {
            throw new ConflictException('Корисник со овој е-маил веќе постои.');
        }

        const newUser = await User.create(userData);

        await this.emailQueue.add(
            'send-welcome-email',
            {
                email: newUser.email,
                name: newUser.firstName,
            },
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            }
        );

        return newUser;
    }

    async findOneByPk(id: number) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundException('User does not exsist')
        }
        return user;
    }

    async findAll() {
        return User.findAll()
    }

    async findByEmail(email: string) {
        return await User.findOne({where: {email: email}})
    }

    async update(id: number, userData: Partial<IUser>) {
        const user = await User.findByPk(id);

        if (!user) {
            throw new NotFoundException("The user does not exist!")
        }

        if (userData.email && userData.email !== user.email) {
            const existingUser = await this.findByEmail(userData.email);
            if (existingUser) {
                throw new ConflictException('Корисник со овој е-маил веќе постои.');
            }
        }

        await user.update(userData);
        return user;
    }

    async remove(id: number) {
        const user = await User.findByPk(id);

        if (!user) {
            throw new NotFoundException("The user does not exist!");
        }

        await user.destroy();
    }
}