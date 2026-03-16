import {DataTypes, ModelStatic, Sequelize} from "sequelize";
import {WineGrapeInstance} from "../../types/wine";

export function defineWineGrape(sequelize: Sequelize): ModelStatic<WineGrapeInstance> {
    return sequelize.define('wineGrape',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            wineId: {
                type: DataTypes.INTEGER,
                field: 'wine_id',
                allowNull: false,
            },
            grapeId: {
                type: DataTypes.INTEGER,
                field: 'grape_id',
                allowNull: false,
            },
            percentage: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: true,
            },
        },
        {
            timestamps: false,
            tableName: 'wine_grapes',
        }
    );
}