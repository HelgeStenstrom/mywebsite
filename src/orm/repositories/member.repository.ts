import {ModelStatic} from "sequelize";
import {MemberCreateDto, MemberDto, MemberInstance} from "../../types/member";

export class MemberRepository {

    constructor(private readonly Member: ModelStatic<MemberInstance>) {}

    async findAll(): Promise<MemberDto[]> {
        const members = await this.Member.findAll();
        return members.map(m => this.toMemberDto(m));
    }

    async create(member:MemberCreateDto): Promise<MemberDto> {
        const memberInstance = await this.Member.create(member);
        return this.toMemberDto(memberInstance);
    }

    private toMemberDto(m: MemberInstance): MemberDto {
        return {
            id: m.id,
            given: m.given,
            surname: m.surname,
        };
    }

    async delete(id: number) {
        const member = await this.Member.findByPk(id);

        if (!member) {
            return 'not_found';
        }

        await this.Member.destroy({where: {id: id}})
        return 'deleted';
    }
}