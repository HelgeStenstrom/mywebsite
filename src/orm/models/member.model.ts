import {DataTypes, ModelStatic, Sequelize} from "sequelize";
import {MemberInstance} from "../../types/member";

export function defineMember(sequelize1: Sequelize): ModelStatic<MemberInstance> {
    return sequelize1.define("member",
        {
            given: DataTypes.TEXT,
            surname: DataTypes.TEXT,
        },
        {
            timestamps: false,
            tableName: "members"
        }
    );
}