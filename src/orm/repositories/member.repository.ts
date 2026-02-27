import {ModelStatic} from "sequelize";
import {MemberDto, MemberInstance} from "../../types/member";

export class MemberRepository {

    constructor(private Member: ModelStatic<MemberInstance>) {}

    async findMembers(): Promise<MemberDto[]> {
        const members = await this.Member.findAll();
        return members.map(m => this.toMemberDto(m));
    }

    postMember(member) {
        return this.Member.create(member);
    }

    private toMemberDto(m: MemberInstance): MemberDto {
        return {
            id: m.id,
            given: m.given,
            surname: m.surname,
        };
    }
}