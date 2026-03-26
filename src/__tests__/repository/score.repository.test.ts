import {Sequelize} from "sequelize";
import {ScoreRepository} from "../../orm/repositories/score.repository";
import {defineScore} from "../../orm/models/score.model";
import {afterEach} from "@jest/globals";
import {ScoreCreateDto} from "../../types/score";

describe('ScoreRepository', () => {
    let sequelize: Sequelize;
    let scoreRepository: ScoreRepository;
2
    beforeEach(async () => {
        sequelize = new Sequelize('test', 'test', 'test', {dialect: "sqlite", logging: false});
        const scoreDefinition = defineScore(sequelize);
        await sequelize.sync({force: true});
        scoreRepository = new ScoreRepository(scoreDefinition);
    });

    afterEach(async () => {
        await sequelize.close();
    });

    test('create returns the created score', async () => {
        const toCreate: ScoreCreateDto = {
            memberId: 1,
            position: 1,
            score: 85
        };
        const created = await scoreRepository.create(1, toCreate);

        expect(created).toEqual({
            id: 1,
            tastingId: 1,
            memberId: 1,
            position: 1,
            score: 85
        });
    });

    test('findAll returns scores for a given tasting', async () => {
        await scoreRepository.create(1, { memberId: 1, position: 1, score: 85 });
        await scoreRepository.create(1, { memberId: 2, position: 1, score: 90 });
        await scoreRepository.create(2, { memberId: 1, position: 1, score: 70 });

        const scores = await scoreRepository.findAllByTastingId(1);

        expect(scores.length).toEqual(2);
        expect(scores).toEqual(expect.arrayContaining([
            { id: 1, tastingId: 1, memberId: 1, position: 1, score: 85 },
            { id: 2, tastingId: 1, memberId: 2, position: 1, score: 90 },
        ]));
    });

    test('delete removes the score', async () => {
        const created = await scoreRepository.create(1, {
            memberId: 1, position: 1, score: 85
        });

        const deleted = await scoreRepository.delete(created.id);
        expect(deleted).toBe("deleted");

        const scores = await scoreRepository.findAllByTastingId(1);
        expect(scores.length).toEqual(0);
    });

    test('delete returns false when score does not exist', async () => {
        const deleted = await scoreRepository.delete(999);
        expect(deleted).toBe("not_found");
    });

    test('update returns the updated score', async () => {
        const created = await scoreRepository.create(1, {
            memberId: 1, position: 1, score: 85
        });

        const updated = await scoreRepository.update(created.id, { score: 92 });

        expect(updated).toEqual({
            id: created.id,
            tastingId: 1,
            memberId: 1,
            position: 1,
            score: 92
        });
    });

    test('update returns null when score does not exist', async () => {
        const updated = await scoreRepository.update(999, { score: 92 });
        expect(updated).toBeNull();
    });

    describe('replaceAll', () => {
        test('replaceAll deletes existing scores and creates new ones', async () => {
            await scoreRepository.create(1, { memberId: 1, position: 1, score: 15 });
            await scoreRepository.create(1, { memberId: 2, position: 1, score: 12 });

            const newScores: ScoreCreateDto[] = [
                { memberId: 1, position: 1, score: 18 },
                { memberId: 3, position: 2, score: 14 },
            ];

            const result = await scoreRepository.replaceAll(1, newScores);

            expect(result).toHaveLength(2);
            expect(result).toEqual(expect.arrayContaining([
                { id: expect.any(Number), tastingId: 1, memberId: 1, position: 1, score: 18 },
                { id: expect.any(Number), tastingId: 1, memberId: 3, position: 2, score: 14 },
            ]));
        });

        test('replaceAll removes all existing scores when given empty array', async () => {
            await scoreRepository.create(1, { memberId: 1, position: 1, score: 15 });

            const result = await scoreRepository.replaceAll(1, []);

            expect(result).toHaveLength(0);
            const remaining = await scoreRepository.findAllByTastingId(1);
            expect(remaining).toHaveLength(0);
        });

        test('replaceAll only affects scores for the given tasting', async () => {
            await scoreRepository.create(1, { memberId: 1, position: 1, score: 15 });
            await scoreRepository.create(2, { memberId: 1, position: 1, score: 12 });

            await scoreRepository.replaceAll(1, []);

            const remaining = await scoreRepository.findAllByTastingId(2);
            expect(remaining).toHaveLength(1);
        });

    })


});