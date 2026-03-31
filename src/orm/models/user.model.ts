import {DataTypes, ModelStatic, Sequelize} from "sequelize";
import {UserInstance} from "../../types/user";

export function defineUser(sequelize: Sequelize): ModelStatic<UserInstance> {
    return sequelize.define<UserInstance>('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        passwordHash: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'password_hash',
        },
        memberId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'member_id',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'created_at',
        },
    }, {
        tableName: 'users',
        timestamps: false,
    });
}