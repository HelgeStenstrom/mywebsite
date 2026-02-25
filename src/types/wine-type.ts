import {Model} from "sequelize";

interface WineTypeAttributes {
    id: number;
    name: string;
}

export interface WineTypeInstance extends Model<WineTypeAttributes>, WineTypeAttributes {
}

export interface WineTypeWithWines extends WineTypeInstance {
    wines?: { id: number }[];
}

export type WineTypeDto = {
    id: number;
    name: string;
    isUsed: boolean;
};