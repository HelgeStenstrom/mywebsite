import {Model} from "sequelize";

export type ScoreDto = {
    id: number;
    tastingId: number;
    memberId: number;
    position: number;
    score: number;
};

export type ScoreCreateDto = {
    memberId: number;
    position: number;
    score: number;
};

export type ScoreUpdateDto = {
    score: number;
};

export interface ScoreAttributes {
    id: number;
    tastingId: number;
    memberId: number;
    position: number;
    score: number;
}

export interface ScoreInstance extends Model<ScoreAttributes>, ScoreAttributes {}