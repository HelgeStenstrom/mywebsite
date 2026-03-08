import {Model} from "sequelize";

export type CountryDto = {
    id: number;
    name: string;
    isUsed: boolean;
};

export type CountryRef = {
    id: number;
    name: string;
};

export type CountryCreateDto = {
    name: string;
}

export interface CountryInstance extends Model<CountryRef>, CountryRef {
}

export interface CountryWithWines extends CountryInstance {
    wines?: { id: number }[];
}