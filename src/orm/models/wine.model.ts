import {DataTypes, ModelStatic, Sequelize} from "sequelize";
import {WineInstance} from "../../types/wine";

export function defineWine(sequelize1: Sequelize): ModelStatic<WineInstance> {
    return sequelize1.define("wine",
        {
            name: DataTypes.STRING(256),
            countryId: {
                type: DataTypes.INTEGER,
                field: 'country', // Name in DB column
                allowNull: false
            },
            wineTypeId: {
                type: DataTypes.INTEGER,
                field: 'winetype', // Name in DB column
                allowNull: false
            },
            systembolaget: DataTypes.INTEGER,

            volume: DataTypes.INTEGER,

            vintageYear: {
                type: DataTypes.INTEGER,
                field: 'vintage_year',
                allowNull: true
            },

            isNonVintage: {
                type: DataTypes.BOOLEAN,
                field: 'is_non_vintage',
                allowNull: false,
                defaultValue: false
            },

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
