import {DataTypes, Sequelize} from "sequelize";
import {CountryInstance} from "../../types/country";

export function defineCountry(sequelize: Sequelize) {
    return sequelize.define<CountryInstance>(
        'countryModel',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(40),
                allowNull: false
            }
        },
        {
            tableName: 'countries',
            timestamps: false
        }
    );
}
