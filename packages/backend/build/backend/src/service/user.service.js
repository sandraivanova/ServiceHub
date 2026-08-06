"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_1 = require("../../../models/src/db-models/user");
let UsersService = class UsersService {
    constructor() {
    }
    async create(userData) {
        const existingUser = await this.findByEmail(userData.email);
        if (existingUser) {
            throw new common_1.ConflictException('Корисник со овој е-маил веќе постои.');
        }
        return user_1.User.create(userData);
    }
    async findAll() {
        return user_1.User.findAll();
    }
    async findOne(id) {
        const user = await user_1.User.findByPk(id);
        if (!user) {
            throw new common_1.NotFoundException(`Корисник со ID ${id} не е пронајден.`);
        }
        return user;
    }
    async findByEmail(email) {
        return await user_1.User.findOne({ where: { email: email } });
    }
    async update(id, userData) {
        const user = await this.findOne(id);
        if (userData.email && userData.email !== user.email) {
            const existingUser = await this.findByEmail(userData.email);
            if (existingUser) {
                throw new common_1.ConflictException('Корисник со овој е-маил веќе постои.');
            }
        }
        await user.update(userData);
        return user;
    }
    async remove(id) {
        const user = await this.findOne(id);
        await user.destroy();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UsersService);
//# sourceMappingURL=user.service.js.map