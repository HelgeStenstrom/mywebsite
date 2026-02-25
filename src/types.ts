import {Model} from "sequelize";

export type CountryDto = {
    id: number;
    name: string;
    isUsed: boolean;
};

interface CountryAttributes {
    id: number;
    name: string;
}

export interface CountryInstance extends Model<CountryAttributes>, CountryAttributes {}
export interface CountryWithWines extends CountryInstance {
    wines?: { id: number }[];
}

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

interface MemberAttributes {
    id: number;
    given: string;
    surname: string;
}

export interface  MemberInstance extends Model<MemberAttributes>, MemberAttributes {}

interface TastingAttributes {
    id: number;
    title: string;
    notes: string;
    date: Date;
}

export interface  TastingInstance extends Model<TastingAttributes>, TastingAttributes {}

interface WineTypeAttributes {
    id: number;
    name: string;
}

export interface WineTypeInstance extends Model<WineTypeAttributes>, WineTypeAttributes {}

export interface WineTypeWithWines extends WineTypeInstance {
    wines?: { id: number }[];
}

export type WineTypeDto = {
    id: number;
    name: string;
    isUsed: boolean;
};

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

export interface WineInstance extends Model<WineAttributes>, WineAttributes, WineAssociations {}

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
