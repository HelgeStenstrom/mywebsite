import {Model} from "sequelize";

export type MemberDto = {
    id: number;
    given: string;
    surname: string;
}

export type MemberCreateDto = {
    given: string;
    surname: string;
}

interface MemberAttributes {
    id: number;
    given: string;
    surname: string;
    isActive: boolean;
}

export interface MemberInstance extends Model<MemberAttributes>, MemberAttributes {}
