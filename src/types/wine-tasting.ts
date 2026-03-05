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

    hosts: WineTastingHostDto[];
}

export type WineTastingCreate = {
    title: string;
    notes: string;
    tastingDate: Date;
    hostIds?: number[];
}

export type WineTastingHostDto = {
    memberId: number;
    name?: string;
}

export type WineTastingWineDto = {
    wineId: number;
    purchasePrice?: number;
    currency?: string;
    order?: number;
}
