import {Model} from "sequelize";

interface TastingAttributes {
    id: number;
    title: string;
    notes: string;
    date: Date;
}

export interface TastingInstance extends Model<TastingAttributes>, TastingAttributes {
}