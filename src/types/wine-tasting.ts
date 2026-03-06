import {Model} from "sequelize";

export type WineTastingDto = {
    id: number;
    title: string;
    notes: string;
    tastingDate: Date;

    hosts: WineTastingHostDto[];
}

export type WineTastingCreateDto = {
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

interface TastingAttributes {
    id: number;
    title: string;
    notes: string;
    tastingDate: Date;
}


interface WineTastingHostAttributes {
    wineTastingId: number;
    memberId: number;
}

export interface WineTastingHostInstance
    extends Model<WineTastingHostAttributes>, WineTastingHostAttributes {}

export interface TastingInstance extends Model<TastingAttributes>, TastingAttributes {
    wineTastingHosts?: WineTastingHostInstance[];
}
