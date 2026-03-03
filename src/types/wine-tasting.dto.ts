import {Model} from "sequelize";

interface TastingAttributes {
    id: number;
    title: string;
    notes: string;
    tastingDate: Date;
}

export interface TastingInstance extends Model<TastingAttributes>, TastingAttributes {
}

export type WineTastingDto = {
    id: number;
    title: string;
    notes: string;
    tastingDate: Date;
}

export type WineTastingCreate = {
    title: string;
    notes: string;
    tastingDate: Date;
}

export interface WineTastingHostDto {
    memberId: number;
}

export interface WineTastingWineDto {
    wineId: number;
    purchasePrice?: number;
    currency?: string;
    order?: number;
}
