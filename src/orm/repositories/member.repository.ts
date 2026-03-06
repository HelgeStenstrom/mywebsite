import {ModelStatic} from "sequelize";
import {MemberCreateDto, MemberDto, MemberInstance} from "../../types/member";

export class MemberRepository {

    constructor(private Member: ModelStatic<MemberInstance>) {}

    async findMembers(): Promise<MemberDto[]> {
        const members = await this.Member.findAll();
        return members.map(m => this.toMemberDto(m));
    }

    async postMember(member:MemberCreateDto): Promise<MemberDto> {
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
}