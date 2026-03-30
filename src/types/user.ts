import {Model} from "sequelize";

export interface UserAttributes {
    id: number;
    email: string;
    passwordHash: string;
    memberId: number | null;
    createdAt: Date;
}

export interface UserCreateDto {
    email: string;
    password: string;
    memberId: number | null;
}

export type UserInstance = Model<UserAttributes> & UserAttributes;