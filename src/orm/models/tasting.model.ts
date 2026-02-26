import {DataTypes, ModelStatic, Sequelize} from "sequelize";
import {TastingInstance} from "../../types/tasting";

export function defineTasting(sequelize1: Sequelize): ModelStatic<TastingInstance> {
    return sequelize1.define("tasting",
        {
            title: DataTypes.STRING(128),
            notes: DataTypes.TEXT('long'),
            date: DataTypes.DATE
        },
        {
            timestamps: false,
            tableName: "tasting"
        }
    );
}
