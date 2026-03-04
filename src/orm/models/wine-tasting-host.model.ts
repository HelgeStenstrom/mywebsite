// orm/models/wine-tasting-host.model.ts
import {DataTypes, ModelStatic, Sequelize} from 'sequelize';

export function defineWineTastingHost(
    sequelize: Sequelize
): ModelStatic<any> {
    return sequelize.define(
        'wine_tasting_host',
        {
            wineTastingId: {
                field: 'wine_tasting_id',
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            memberId: {
                field: 'member_id',
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: 'wine_tasting_hosts',
            timestamps: false,
            underscored: true,
        }
    );
}
