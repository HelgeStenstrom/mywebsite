import {Model} from "sequelize";

// This DTO must match components.schemas.WineType in hartappat.yaml
export type WineTypeDto = {
    id: number;
    name: string;
    isUsed: boolean;
}
export type WineTypeRef = {
    id: number;
    name: string;
};



export interface WineTypeInstance extends Model<WineTypeRef>, WineTypeRef {
}

export interface WineTypeWithWines extends WineTypeInstance {
    wines?: { id: number }[];
}

