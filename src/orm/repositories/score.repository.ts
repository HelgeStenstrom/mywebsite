import {ScoreCreateDto, ScoreDto, ScoreInstance} from "../../types/score";
import {ModelStatic} from "sequelize";
import {DeleteResult} from "../../types/common-types";

export class ScoreRepository {

constructor(
    private readonly Score: ModelStatic<ScoreInstance>,
) {}

    async create(tastingId: number, scoreCreateDto: ScoreCreateDto): Promise<ScoreDto> {

    const created = await this.Score.create({tastingId, ...scoreCreateDto});
    return this.toDto(created);
    }

    private toDto(created: ScoreInstance) {
        return {
            id: created.id,
            tastingId: created.tastingId,
            memberId: created.memberId,
            position: created.position,
            score: created.score,
        };
    }

    async findAllByTastingId(tastingId: number): Promise<ScoreDto[]> {
        const scores = await this.Score.findAll({where: {tastingId}});
        return scores.map(this.toDto);
    }

    async delete(scoreId: number): Promise<DeleteResult> {
        const score = await this.Score.findByPk(scoreId);
        if (!score) {
            return 'not_found';
        }
        await this.Score.destroy({where: {id: scoreId}});
        return 'deleted';
    }

    async update(scoreId: number, score: { score: number }): Promise<ScoreDto | null> {
        const {id: _ignored, ...safeData} = score as any;
        await this.Score.update(safeData, {where: {id: scoreId}});
        const updated = await this.Score.findByPk(scoreId);
        if (!updated) {
            return null;
        }
        return this.toDto(updated);
    }

    async replaceAll(tastingId: number, newScores: ScoreCreateDto[]): Promise<ScoreDto[]> {

        await this.Score.destroy({ where: { tastingId } });
        const created = await Promise.all(
            newScores.map(score => this.Score.create({ tastingId, ...score }))
        );
        return created.map(this.toDto);
    }
}