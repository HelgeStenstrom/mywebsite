import {DataTypes, ModelStatic, Sequelize} from "sequelize";
import {WineTastingWineInstance} from "../../types/wine-tasting";

export function defineWineTastingWine(sequelize: Sequelize): ModelStatic<WineTastingWineInstance> {
    return sequelize.define("wineTastingWine",
        {
            wineTastingId: {
                type: DataTypes.INTEGER,
                field: 'wine_tasting_id',
                allowNull: false,
            },
            wineId: {
                type: DataTypes.INTEGER,
                field: 'wine_id',
                allowNull: false,
            },
            position: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            purchasePrice: {
                type: DataTypes.INTEGER,
                field: 'purchase_price',
                allowNull: true,
            },
            averageScore: {
                type: DataTypes.DECIMAL(4, 2),
                field: 'average_score',
                allowNull: true,
            },
        },
        {
            timestamps: false,
            tableName: "wine_tasting_wines",
        }
    );
}