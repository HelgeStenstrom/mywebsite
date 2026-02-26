import {DataTypes, Sequelize} from "sequelize";
import {GrapeInstance} from "../../types/grape";

export function defineGrape(sequelize1: Sequelize) {
    return sequelize1.define<GrapeInstance>("grape",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: DataTypes.TEXT,
            color: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [['blå', 'grön', 'annan', 'okänd']]
                }
            }
        },
        {
            timestamps: false,
            tableName: "grapes"
        }
    );
}
