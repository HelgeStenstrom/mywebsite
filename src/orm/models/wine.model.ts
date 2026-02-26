import {DataTypes, ModelStatic, Sequelize} from "sequelize";
import {WineInstance} from "../../types/wine";

export function defineWine(sequelize1: Sequelize): ModelStatic<WineInstance> {
    return sequelize1.define("wine",
        {
            name: DataTypes.STRING(256),
            systembolaget: DataTypes.INTEGER,
            volume: DataTypes.INTEGER,

            createdAt: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            timestamps: false,
            tableName: "wines"
        }
    );
}
