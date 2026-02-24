import {DataTypes, Model, ModelStatic, Options, Sequelize, SyncOptions} from 'sequelize';
import {CountryDto, WineTypeDto} from "./types";

export interface GrapeAttributes {
    id: number;
    name: string;
    color: string;
}

interface GrapeInstance extends Model<GrapeAttributes>, GrapeAttributes {}

interface WineAssociations {
    winetypeModel: {
        id: number;
        name: string;
    };

    countryModel: {
        id: number;
        name: string;
    };
}

interface WineAttributes {
    id: number;
    name: string;
    systembolaget: number;
    volume: number;
    createdAt?: Date;
}

interface WineInstance extends Model<WineAttributes>, WineAttributes, WineAssociations {}

interface CountryAttributes {
    id: number;
    name: string;
}
export interface CountryInstance extends Model<CountryAttributes>, CountryAttributes {}
interface CountryWithWines extends CountryInstance {
    wines?: { id: number }[];
}

interface WineTypeAttributes {
    id: number;
    name: string;
}
export interface WineTypeInstance extends Model<WineTypeAttributes>, WineTypeAttributes {}

interface WineTypeWithWines extends WineTypeInstance {
    wines?: { id: number }[];
}

interface MemberAttributes {
    id: number;
    given: string;
    surname: string;
}

export interface  MemberInstance extends Model<MemberAttributes>, MemberAttributes {}

interface TastingAttributes {
    id: number;
    title: string;
    notes: string;
    date: Date;
}

export interface  TastingInstance extends Model<TastingAttributes>, TastingAttributes {}

function defineCountry(sequelize: Sequelize) {
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

function defineGrape(sequelize1: Sequelize) {
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
                allowNull: true,
                validate: {
                    isIn: [['blå', 'grön']]
                }
            }
        },
        {
            timestamps: false,
            tableName: "grapes"
        }
    );
}

function defineTasting(sequelize1: Sequelize): ModelStatic<TastingInstance> {
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

function defineMember(sequelize1: Sequelize): ModelStatic<MemberInstance> {
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

function defineWineType(sequelize1: Sequelize): ModelStatic<WineTypeInstance> {
    return sequelize1.define("winetypeModel",
        {
            name: DataTypes.STRING(20),
        },
        {
            timestamps: false,
            tableName: "winetypes"
        }
    );
}

function defineWine(sequelize1: Sequelize): ModelStatic<WineInstance> {
    return sequelize1.define("wine",
        {
            name: DataTypes.STRING(256),
            systembolaget: DataTypes.INTEGER,
            volume: DataTypes.INTEGER,

            createdAt: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            timestamps: false,
            tableName: "wines"
        }
    );
}

export class Orm {


    sequelize: Sequelize;
    private Grape: ModelStatic<GrapeInstance>;
    private Tasting: ModelStatic<TastingInstance>;
    private Country: ModelStatic<CountryInstance>;
    private Wine: ModelStatic<WineInstance>;
    private WineType: ModelStatic<WineTypeInstance>;
    private Member: ModelStatic<MemberInstance>;




    constructor(database: string, dbUserName: string, dbPassword: string, options: Options) {
        this.sequelize = new Sequelize(database, dbUserName, dbPassword, options);


        this.Country = defineCountry(this.sequelize);
        this.Grape = defineGrape(this.sequelize)
        this.Tasting = defineTasting(this.sequelize)
        this.Member = defineMember(this.sequelize)
        this.WineType = defineWineType(this.sequelize)
        this.Wine = defineWine(this.sequelize)

        this.Wine.belongsTo(this.Country, {
            foreignKey: 'country',
            as: 'countryModel'
        });
        this.Country.hasMany(this.Wine, {
            foreignKey: 'country',
            as: 'wines'
        });

        this.Wine.belongsTo(this.WineType, {
            foreignKey: 'winetype',
            as: 'winetypeModel'
        });
        this.WineType.hasMany(this.Wine, {
            foreignKey: 'winetype',
            as: 'wines'
        });
    }

    async sync() {
        await this.sequelize.sync({ force: true });
    }


    createTables() {
        const opts: SyncOptions = {logging: false}; // TODO: Turn off logging, there's too much!
        return this.sequelize.sync(opts);
    }

    findTastings(): Promise<TastingInstance[]> {
        return this.Tasting.findAll();
    }

    getTasting(id: number) {
        return this.Tasting.findByPk(id);
    }

    findGrapes(): Promise<GrapeInstance[]> {
        return this.Grape.findAll();
    }

    findMembers(): Promise<MemberInstance[]> {

        return this.Member.findAll();
    }


    /**
     * Returns a promise that resolves to an array of CountryInstance objects.
     * Return all countries in the database.
     */
    async findCountries(): Promise<CountryDto[]> {
        const countries = await this.Country.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']], // sortera alfabetiskt
            include: [
                {
                    model: this.Wine,
                    as: 'wines',
                    attributes: ['id'],
                    required: false,
                }
            ]
        }) as CountryWithWines[];

        return countries.map(c => ({
            id: c.id,
            name: c.name,
            isUsed: c.wines?.length > 0
        }));
    }

    async postWine(param: {
        country: number; name: string; systembolaget: number; volume: number; winetype: number
    }) {
        return this.Wine.create(param);
    }

    findWines() {
        const promise = this.Wine.findAll(
            {
                include: [
                    {
                        model: this.WineType,
                        as: 'winetypeModel',
                        attributes: ['id', 'name'],
                        required: true
                    },
                    {
                        model: this.Country,
                        as: 'countryModel',
                        attributes: ['id', 'name'],
                        required: true
                    }
                ]
            }
        );
        return promise.then(m => {
                return m.map(x => {

                    return {
                        id: x.id,
                        name: x.name,
                        systembolaget: x.systembolaget,
                        volume: x.volume,
                        createdAt: x.createdAt,

                        wineType: {
                            id: x.winetypeModel.id,
                            name: x.winetypeModel.name
                        },
                        country: {
                            id: x.countryModel.id,
                            name: x.countryModel.name
                        },
                    };
                });
            }
        );
    }


    postGrape(grape) {

        //console.log(`In Orm.postGrape(${grape.name})`)
        // See https://sequelize.org/api/v6/class/src/model.js~model#static-method-create
        return this.Grape.create(grape);
    }

    postTasting(tasting) {
        return this.Tasting.create(tasting);
    }

    postCountry(country): Promise<CountryInstance> {
        return this.Country.create(country);
    }

    postMember(member) {
        return this.Member.create(member);
    }

    delGrape(name: string) {

        // See https://sequelize.org/api/v6/class/src/model.js~model#static-method-destroy
        return this.Grape.destroy({
            where: {name: name}
        });
    }

    delGrapeById(id: number) {
        return this.Grape.destroy({where: {id: id}})
    }

    getGrape(id: number) {
        return this.Grape.findByPk(id);
    }

    patchGrapeByNameAndColor(from: GrapeAttributes, to: GrapeAttributes) {

        // See https://sequelize.org/api/v6/class/src/model.js~model#static-method-update

        return this.Grape.update(
            {name: to.name, color: to.color},
            {where: {name: from.name}}
        );
    }

    async findWineTypes(): Promise<WineTypeDto[]> {
        const models = await this.WineType.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']],
            include: [
                {
                    model: this.Wine,
                    as: 'wines',
                    attributes: ['id'],
                    required: false
                }
            ]
        }) as WineTypeWithWines[];

        return models.map(t => ({
            id: t.id,
            name: t.name,
            isUsed: t.wines?.length > 0
        }));
    }


    async postWineType(param: { name: string }) {
        return this.WineType.create(param);
    }

    async delWineById(id: number) {
        return this.Wine.destroy({
            where: {id: id}
        });
    }

    async delCountryById(id: number) {
        const country: CountryWithWines = await this.Country.findByPk(id, {
            include: [{ model: this.Wine, as: 'wines', attributes: ['id'], required: false }]
        });

        if (!country) {
            return 'not_found';
        }
        if (country.wines?.length > 0) {
            return 'in_use';
        }

        await this.Country.destroy({where: {id: id}})
        return 'deleted';
    }

    async delWineTypeById(id: any) {
        const wineType: CountryWithWines = await this.WineType.findByPk(id, {
            include: [{ model: this.Wine, as: 'wines', attributes: ['id'], required: false }]
        });

        if (!wineType) {
            return 'not_found';
        }
        if (wineType.wines?.length > 0) {
            return 'in_use';
        }

        await this.WineType.destroy({where: {id: id}})
        return 'deleted';
    }
}
