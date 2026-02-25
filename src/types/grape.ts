import {Model} from "sequelize";

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