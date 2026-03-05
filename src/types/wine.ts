import {Model} from "sequelize";
import {WineTypeDto} from "./wine-type";
import {CountryDto} from "./country";

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
    vintageYear?: number | null;
    isNonVintage?: boolean;
    systembolaget?: number;
    volume: number;
};
interface WineAssociations {
    winetypeModel?: WineTypeDto;
    countryModel?: CountryDto;
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
    systembolaget: number;
    volume: number;
    createdAt?: Date;
}

/**
 * Used for Sequelize
 */
export interface WineInstance extends Model<WineAttributes>, WineAttributes, WineAssociations {}
