import {Model} from "sequelize";

export type GrapeDto = {
    id: number;
    name: string;
    color: GrapeColor;
};

export type GrapeCreateDto = {
    name: string;
    color: GrapeColor;
}

export interface GrapeAttributes {
    id: number;
    name: string;
    color: string;
}

export interface GrapeInstance extends Model<GrapeAttributes>, GrapeAttributes {}

export type GrapeColor = 'blå' | 'grön' | 'annan' | 'okänd';