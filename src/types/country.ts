import {Model} from "sequelize";

export type CountryDto = {
    id: number;
    name: string;
    isUsed: boolean;
};

export type CountryCreateDto = {
    name: string;
}

interface CountryAttributes {
    id: number;
    name: string;
}

export interface CountryInstance extends Model<CountryAttributes>, CountryAttributes {
}

export interface CountryWithWines extends CountryInstance {
    wines?: { id: number }[];
}