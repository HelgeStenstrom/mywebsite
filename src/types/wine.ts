import {Model} from "sequelize";
import {CountryDto} from "./country";
import {WineTypeDto} from "./wine-type";

interface WineAssociations {
    winetypeModel: {
        id: number;
        name: string;
    };

    countryModel: {
        id: number;
        name: string;
    };
}

interface WineAttributes {
    id: number;
    name: string;
    systembolaget: number;
    volume: number;
    createdAt?: Date;
}

export interface WineInstance extends Model<WineAttributes>, WineAttributes, WineAssociations {
}

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