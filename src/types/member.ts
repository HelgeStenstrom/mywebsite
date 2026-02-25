import {Model} from "sequelize";

interface MemberAttributes {
    id: number;
    given: string;
    surname: string;
}

export interface MemberInstance extends Model<MemberAttributes>, MemberAttributes {}