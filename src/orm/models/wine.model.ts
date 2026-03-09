import {DataTypes, ModelStatic, Sequelize} from "sequelize";
import {WineInstance} from "../../types/wine";

export function defineWine(sequelize1: Sequelize): ModelStatic<WineInstance> {
    return sequelize1.define("wine",
        {
            name: DataTypes.STRING(256),
            countryId: {
                type: DataTypes.INTEGER,
                field: 'country_id', // Name in DB column
                allowNull: false
            },
            wineTypeId: {
                type: DataTypes.INTEGER,
                field: 'wine_type_id', // Name in DB column
                allowNull: false
            },
            systembolaget: {
                type: DataTypes.INTEGER,
                allowNull: true
            },

            volume: {
                type: DataTypes.INTEGER,
                allowNull: true
            },

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
                field: 'created_at',
                allowNull: true
            }
        },
        {
            timestamps: false,
            tableName: "wines"
        }
    );
}
