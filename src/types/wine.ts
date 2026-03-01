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
    isNonVintage?: boolean;
    createdAt?: Date;
}

export interface WineInstance extends Model<WineAttributes>, WineAttributes, WineAssociations {}

export type WineDto = {
    id: number;
    name: string;
    systembolaget: number;
    volume: number;
    vintageYear?: number | null;
    isNonVintage?: boolean;
    createdAt: Date;
    wineType: WineTypeDto;
    country: CountryDto;
};

export type WineCreateDto = {
    name: string;
    countryId: number;
    wineTypeId: number;
    systembolaget: number;
    volume: number;
};