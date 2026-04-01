import {ModelStatic} from "sequelize";
import {UserAttributes, UserCreateDto, UserInstance} from "../../types/user";
import bcrypt from "bcrypt";

export class UserRepository {

    constructor(private readonly user: ModelStatic<UserInstance>) {}


    async create(dto: UserCreateDto): Promise<UserAttributes> {
        const passwordHash = await bcrypt.hash(dto.password, 10);

        const instance = await this.user.create({
            email: dto.email,
            passwordHash,
            memberId: dto.memberId,
            createdAt: new Date(),
        });
        return instance.get();
    }

    async findByEmail(email: string): Promise<UserAttributes | null> {
        const instance = await this.user.findOne({where: {email}});
        return instance ? instance.get() : null;
    }

    async findById(id: number): Promise<UserAttributes | null> {
        const instance = await this.user.findByPk(id);
        return instance ? instance.get() : null;
    }

    async updatePassword(id: number, newSecret: string) {
        const passwordHash = await bcrypt.hash(newSecret, 10);
        await this.user.update({passwordHash}, {where: {id}});

    }
}