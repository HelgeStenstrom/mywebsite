import {Model} from "sequelize";
import {WineTypeDto, WineTypeRef} from "./wine-type";
import {CountryDto, CountryRef} from "./country";

// This DTO must match components.schemas.WineDto in hartappat.yaml
export type WineDto = {
    id: number;
    name: string;
    country: CountryRef;
    wineType: WineTypeRef;
    grapes?: WineGrapeDto[];
    vintageYear: number | null;
    isNonVintage: boolean;
    systembolaget: number | null;
    volume: number | null;
    createdAt: Date;
    isUsed: boolean;
    lastTastingId: number | null;
    lastTasted?: string | null;
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
    wineTastingWines?: { id: number; wineTastingId: number; wineTasting?: { tastingDate: string } }[];
    wineGrapes?: WineGrapeDto[];
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
    createdAt?: Date;
}

/**
 * Used for Sequelize
 */
export interface WineInstance extends Model<WineAttributes>, WineAttributes, WineAssociations {}


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
