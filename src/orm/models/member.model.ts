import {DataTypes, ModelStatic, Sequelize} from "sequelize";
import {MemberInstance} from "../../types/member";

export function defineMember(sequelize1: Sequelize): ModelStatic<MemberInstance> {
    return sequelize1.define("member",
        {
            given: DataTypes.TEXT,
            surname: DataTypes.TEXT,
            isActive: {
                field: 'is_active',
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            timestamps: false,
            tableName: "members"
        }
    );
}