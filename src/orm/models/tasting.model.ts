import {DataTypes, ModelStatic, Sequelize} from "sequelize";
import {TastingInstance} from "../../types/wine-tasting.dto";

export function defineTasting(sequelize1: Sequelize): ModelStatic<TastingInstance> {
    return sequelize1.define("tasting",
        {
            title: DataTypes.STRING(128),
            notes: DataTypes.TEXT('long'),
            tastingDate: {
                field: 'tasting_date',
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
        },
        {
            timestamps: true,
            underscored: true,
            tableName: "wine_tastings",
        }
    );
}
