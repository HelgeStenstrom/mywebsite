import {
    WineTastingWineCreateDto,
    WineTastingWineDto,
    WineTastingWineInstance,
    WineTastingWineUpdateDto
} from "../../types/wine-tasting";
import {ModelStatic} from "sequelize";
import {ScoreInstance} from "../../types/score";
import {average, standardDeviation} from "../../utils/statistics";

export class WineTastingWineRepository {

    constructor(
        private readonly WineTastingWine: ModelStatic<WineTastingWineInstance>,
        private readonly Score: ModelStatic<ScoreInstance>,
    ) {}

    async create(
        wineTastingId: number,
        wine: WineTastingWineCreateDto,
    ): Promise<WineTastingWineDto> {

        const created = await this.WineTastingWine.create({
            wineTastingId: wineTastingId,
            wineId: wine.wineId,
            position: wine.position,
            purchasePrice: wine.purchasePrice ?? null,
            averageScore: wine.averageScore ?? null,
        });

        return this.toDto(created, wineTastingId);
    }

    async findByTastingId(wineTastingId: number): Promise<WineTastingWineDto[]> {
        const wines = await this.WineTastingWine.findAll({
            where: { wineTastingId },
        });

        const scores = await this.Score.findAll({
            where: { tastingId: wineTastingId },
        });

        const winePositionCount = wines.filter(w => w.position !== null).length;
        const scorePositionCount = new Set(scores.map(s => s.position)).size;
        const positionsMatch = winePositionCount === scorePositionCount;

        return Promise.all(wines.map(w => this.toDto(w, wineTastingId, positionsMatch ? scores : [])));
    }


    private async toDto(
        wine: WineTastingWineInstance,
        wineTastingId: number,
        scores?: ScoreInstance[]
    ): Promise<WineTastingWineDto> {

        const resolvedScores = scores ?? await this.Score.findAll({
            where: { tastingId: wineTastingId, position: wine.position },
        });

        const relevantScores = scores !== undefined
            ? resolvedScores.filter(s => s.position === wine.position)
            : resolvedScores;

        const scoreValues = relevantScores.map(s => Number(s.score));
        const hasScores = scoreValues.length > 0;

        return {
            id: wine.id,
            wineId: wine.wineId,
            position: wine.position,
            purchasePrice: wine.purchasePrice ?? null,
            averageScore: hasScores ? average(scoreValues) : (wine.averageScore ?? null),
            scoreStdDev: hasScores ? standardDeviation(scoreValues) : null,
        };


    }    async delete(wineTastingId: number, tastingWineId: number) {
        const existing = await this.WineTastingWine.findOne({ where: { id: tastingWineId, wineTastingId } });
        if (!existing) {
            return 'not_found';
        }
        const number = await this.WineTastingWine.destroy({where: {id: tastingWineId}});
        if (number === 0) {
            return 'not_found';
        }
        return 'deleted'
    }

    async update(id: number, toUpdate: WineTastingWineUpdateDto) {
        const {wineId, position, purchasePrice, averageScore} = toUpdate;
        await this.WineTastingWine.update(
            {wineId, position, purchasePrice, averageScore},
            {where: {id}});

        const updated = await this.WineTastingWine.findByPk(id);
        if (!updated) {
            throw new Error('WineTastingWine not found');
        }
        return this.toDto(updated, updated.wineTastingId);
    }

    async updatePositions(tastingId: number, positions: { id: number, position: number }[]): Promise<void> {
        await this.WineTastingWine.sequelize.transaction(async (t) => {
            await Promise.all(
                positions.map(({ id, position }) =>
                    this.WineTastingWine.update(
                        { position },
                        { where: { id, wineTastingId: tastingId }, transaction: t }
                    )
                )
            );
        });
    }}