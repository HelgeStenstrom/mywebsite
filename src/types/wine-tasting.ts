import {Model} from "sequelize";

export type WineTastingDto = {
    id: number;
    title: string;
    notes: string;
    tastingDate: Date;
    hosts: WineTastingHostDto[];
    wines: WineTastingWineDto[];
}

export type WineTastingSummaryDto = {
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
}

export type WineTastingHostCreateDto = {
    memberId: number;
};

interface WineTastingAttributes {
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


export interface WineTastingInstance extends Model<WineTastingAttributes>, WineTastingAttributes {
    wineTastingHosts?: WineTastingHostInstance[];
    wineTastingWines?: WineTastingWineInstance[];
}


export type WineTastingWineDto = {
    id:number;
    wineId: number;
    position: number | null;
    purchasePrice?: number | null;
    averageScore?: number | null;
    scoreStdDev?: number | null;
}

export type WineTastingWineCreateDto = {
    wineId: number;
    position: number | null;
    purchasePrice?: number | null;
    averageScore?: number | null;
}

interface WineTastingWineAttributes {
    id: number;
    wineTastingId: number;
    wineId: number;
    position: number | null;
    purchasePrice?: number | null;
    averageScore?: number | null;
}

export interface WineTastingWineInstance
    extends Model<WineTastingWineAttributes>, WineTastingWineAttributes {}

export type WineTastingWineUpdateDto = {
    position?: number;
    wineId?: number;
    purchasePrice?: number | null;
    averageScore?: number | null;
}
