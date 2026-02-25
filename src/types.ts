import {Model} from "sequelize";

export type WineDto = {
    id: number;
    name: string;
    country: CountryDto;
    wineType: WineTypeDto;
    systembolaget?: number;
    volume?: number;
};

export type WineCreateDto = {
    id: number;
    name: string;
    countryId: number;
    wineTypeId: number;
    systembolaget?: number;
    volume?: number;
};

export type WineTypeDto = {
    id: number;
    name: string;
    isUsed: boolean;
};

export type CountryDto = {
    id: number;
    name: string;
    isUsed: boolean;
};

export interface GrapeAttributes {
    id: number;
    name: string;
    color: string;
}

export interface GrapeInstance extends Model<GrapeAttributes>, GrapeAttributes {}

export type GrapeDto = {
    id: number;
    name: string;
    color: GrapeColor;
};

export type GrapeCreate = {
    name: string;
    color: GrapeColor;
}

export type GrapeColor = 'blå' | 'grön' | 'annan' | 'okänd';