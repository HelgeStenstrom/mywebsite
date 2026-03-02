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

// This DTO must match components.schemas.WineTypeDto in hartappat.yaml
export type WineTypeDto = {
    id: number;
    name: string;
    isUsed: boolean;
};