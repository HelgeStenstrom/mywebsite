import { DataTypes, Model, ModelStatic, Options, Sequelize } from 'sequelize';

export interface GrapeAttributes {
    id: number;
    name: string;
    color: string;
}

interface GrapeInstance extends Model<GrapeAttributes>, GrapeAttributes {}

interface WineAttributes {
    id: number;
    name: string;
    systembolaget: number;
    volume: number;
}

interface WineInstance extends Model<WineAttributes>, WineAttributes {}

interface CountryAttributes {
    id: number;
    name: string;
}
export interface CountryInstance extends Model<CountryAttributes>, CountryAttributes {}

interface WineTypeAttributes {
    id: number;
    sv: string;
    en: string;
}
export interface WineTypeInstance extends Model<WineTypeAttributes>, WineTypeAttributes {}

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


        this.Grape = this.sequelize.define<GrapeInstance>("grape",
            { id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: DataTypes.TEXT,
                color: DataTypes.TEXT
            },
            {
                timestamps: false,
                tableName: "grapes"
            }
        )

        this.Country = this.sequelize.define("countryModel",
            {
                name: DataTypes.TEXT,
            },
            {
                timestamps: false,
                tableName: "countries"
            }
        )

        this.Tasting = this.sequelize.define("tasting",
            {
                title: DataTypes.TEXT,
                notes: DataTypes.TEXT,
                date: DataTypes.DATE
            },
            {
                timestamps: false,
                tableName: "tasting"
            }
        )

        this.Member = this.sequelize.define("member",
            {
                given: DataTypes.TEXT,
                surname: DataTypes.TEXT,
            },
            {
                timestamps: false,
                tableName: "members"
            }
        )

        this.WineType = this.sequelize.define("winetypeModel",
            {
                sv: DataTypes.TEXT,
                en: DataTypes.TEXT
            },
            {
                timestamps: false,
                tableName: "winetypes"
            }
        )

        this.Wine = this.sequelize.define("wine",
            {
               // country: DataTypes.TEXT,
                name: DataTypes.TEXT,
                systembolaget: DataTypes.INTEGER,
                volume: DataTypes.INTEGER,
                //winetype: DataTypes.TEXT,
            },
            {
                timestamps: false,
                tableName: "wines"
            }
        )

        this.Wine.belongsTo(this.Country, {foreignKey: 'country'});
        this.Country.hasMany(this.Wine, {
            foreignKey: 'country'
        });

        this.Wine.belongsTo(this.WineType, {foreignKey: 'winetype'});
        this.WineType.hasMany(this.Wine, {
            foreignKey: 'winetype'
        });
    }


    createTables() {
        return this.sequelize.sync();
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


    findCountries(): Promise<CountryInstance[]> {
        return this.Country.findAll();
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
                        attributes: ['sv'],
                        required: true
                    },
                    {
                        model: this.Country,
                        attributes: ['name'],
                        required: true
                    }
                ]
            }
        );
        return promise.then(m => {
                return m.map(x => {
                    console.log('In model mapping lambda: x.name = ', x['name']);
                    console.log('In model mapping lambda: x.winetypeModel.sv = ', x['winetypeModel'].sv);
                    //return x;
                    return {
                        id: x['id'],
                        name: x['name'],
                        systembolaget: x['systembolaget'],
                        category: x['winetypeModel'].sv,
                        country: x['countryModel'].name,
                        volume: x['volume'],
                    };
                });
            }
        );
    }

    findWinesNoOptions() {
        return this.Wine.findAll();
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

    async findWineTypes() {
        return this.WineType.findAll();
    }


    async postWineType(param: { sv: string; en: string }) {
        return this.WineType.create(param);
    }

    async delWineById(id: number) {
        return this.Wine.destroy({
            where: {id: id}
        });
    }
}
