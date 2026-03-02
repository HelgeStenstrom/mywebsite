import {Model} from "sequelize";

interface TastingAttributes {
    id: number;
    title: string;
    notes: string;
    date: Date;
}

export interface TastingInstance extends Model<TastingAttributes>, TastingAttributes {
}

export type TastingDto = {
    id: number;
    title: string;
    notes: string;
    tastingDate: Date;
}

export type TastingCreate = {
    title: string;
    notes: string;
    date: Date;
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
