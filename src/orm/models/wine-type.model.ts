import {DataTypes, ModelStatic, Sequelize} from "sequelize";
import {WineTypeInstance} from "../../types/wine-type";

export function defineWineType(sequelize1: Sequelize): ModelStatic<WineTypeInstance> {
    return sequelize1.define("winetypeModel",
        {
            name: DataTypes.STRING(20),
        },
        {
            timestamps: false,
            tableName: "wine_types"
        }
    );
}
