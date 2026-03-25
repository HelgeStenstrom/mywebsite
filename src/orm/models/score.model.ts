import {DataTypes, Sequelize} from "sequelize";
import {ScoreInstance} from "../../types/score";

export function defineScore(sequelize: Sequelize) {
    return sequelize.define<ScoreInstance>("score",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            tastingId: {
                type: DataTypes.INTEGER,
                field: 'tasting_id',
                allowNull: false
            },
            memberId: {
                type: DataTypes.INTEGER,
                field: 'member_id',
                allowNull: false
            },
            position: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            score: {
                type: DataTypes.DECIMAL(4, 1),
                allowNull: false
            }
        },
        {
            timestamps: false,
            tableName: "scores"
        }
    );
}