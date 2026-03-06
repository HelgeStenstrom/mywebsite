// orm/models/wine-tasting-host.model.ts
import {DataTypes, ModelStatic, Sequelize} from 'sequelize';
import {WineTastingHostInstance} from "../../types/wine-tasting";

export function defineWineTastingHost(
    sequelize: Sequelize
): ModelStatic<WineTastingHostInstance> {
    return sequelize.define(
        'wine_tasting_host',
        {
            wineTastingId: {
                field: 'wine_tasting_id',
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            memberId: {
                field: 'member_id',
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
        },
        {
            tableName: 'wine_tasting_hosts',
            timestamps: false,
            underscored: true,
        }
    );
}
