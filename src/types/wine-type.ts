import {Model} from "sequelize";

// This DTO must match components.schemas.WineType in hartappat.yaml
export type WineTypeDto = {
    id: number;
    name: string;
    isUsed: boolean;
};

interface WineTypeAttributes {
    id: number;
    name: string;
}

export interface WineTypeInstance extends Model<WineTypeAttributes>, WineTypeAttributes {
}

export interface WineTypeWithWines extends WineTypeInstance {
    wines?: { id: number }[];
}

