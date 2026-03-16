import {Model} from "sequelize";
import {WineTypeDto, WineTypeRef} from "./wine-type";
import {CountryDto, CountryRef} from "./country";

// This DTO must match components.schemas.WineDto in hartappat.yaml
export type WineDto = {
    id: number;
    name: string;
    country: CountryRef;
    wineType: WineTypeRef;
    vintageYear: number | null;
    isNonVintage: boolean;
    systembolaget: number | null;
    volume: number | null;
    createdAt: Date; // TODO: bör det kunna vara null?
    isUsed: boolean;
};

export type WineCreateDto = {
    name: string;
    countryId: number;
    wineTypeId: number;
    vintageYear?: number | null;
    isNonVintage?: boolean | null; // default is set by WineRepository
    systembolaget?: number | null;
    volume?: number | null;
};

interface WineAssociations {
    winetypeModel?: WineTypeDto;
    countryModel?: CountryDto;
    wineTastingWines?: { id: number }[];
}

/**
 * Used for Sequelize
 */
interface WineAttributes {
    id: number;
    name: string;
    countryId: number;
    wineTypeId: number;
    vintageYear?: number | null;
    isNonVintage: boolean;
    systembolaget: number | null;
    volume: number | null;
    createdAt?: Date; // TODO: bör det kunna vara null?
}

/**
 * Used for Sequelize
 */
export interface WineInstance extends Model<WineAttributes>, WineAttributes, WineAssociations {}

export interface WineWithTasting extends WineInstance {
    wineTastingWines?: { id: number }[];
}


export type WineGrapeDto = {
    id: number;
    wineId: number;
    grapeId: number;
    percentage: number | null;
};

export type WineGrapeCreateDto = {
    grapeId: number;
    percentage?: number | null;
};

export interface WineGrapeAttributes {
    id: number;
    wineId: number;
    grapeId: number;
    percentage?: number | null;
}

export interface WineGrapeInstance extends Model<WineGrapeAttributes>, WineGrapeAttributes {}
