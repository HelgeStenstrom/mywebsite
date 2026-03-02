import {Model} from "sequelize";
import {WineTypeDto} from "./wine-type";
import {CountryDto} from "./country";

interface WineAssociations {
    winetypeModel?: WineTypeDto;
    countryModel?: CountryDto;
}

interface WineAttributes {
    id: number;
    name: string;
    systembolaget: number;
    volume: number;
    vintageYear?: number | null;
    isNonVintage: boolean;
    createdAt?: Date;
}

export interface WineInstance extends Model<WineAttributes>, WineAttributes, WineAssociations {}

// This DTO must match components.schemas.WineDto in hartappat.yaml
export type WineDto = {
    id: number;
    name: string;
    country: CountryDto;
    wineType: WineTypeDto;
    vintageYear: number | null;
    isNonVintage: boolean;
    systembolaget: number;
    volume: number;
    createdAt: Date;
};

export type WineCreateDto = {
    name: string;
    countryId: number;
    wineTypeId: number;
    systembolaget: number;
    volume: number;
};