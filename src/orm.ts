import {DataTypes, Model, ModelStatic, Options, Sequelize} from 'sequelize';

export class Orm {


    sequelize: Sequelize;
    private Grape: ModelStatic<Model>;
    private Tasting: ModelStatic<Model>;
    private Country: ModelStatic<Model>;
    private Wine: ModelStatic<Model>;
    private WineType: ModelStatic<Model>;
    private Member: ModelStatic<Model>;


    testAuthentication() {
        const promise = this.sequelize.authenticate();
        promise.then(x => console.log('Sequelize authentication passed', x));
    }

    constructor(database: string, dbUserName: string, dbPassword: string, options: Options) {
        this.sequelize = new Sequelize(database, dbUserName, dbPassword, options);
        this.testAuthentication();

        this.Grape = this.sequelize.define("grape",
            {
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
                date: DataTypes.TEXT
            },
            {
                timestamps: false,
                tableName: "tasting"
            }
        )

        this.Member = this.sequelize.define("member",
            {
                Förnamn: DataTypes.TEXT,
                Efternamn: DataTypes.TEXT,
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

    findTastings(): Promise<object[]> {
        return this.Tasting.findAll();
    }

    getTasting(id: number) {
        return this.Tasting.findByPk(id);
    }

    findGrapes(): Promise<object[]> {
        return this.Grape.findAll();
    }

    findMembers(): Promise<object[]> {

        return this.Member.findAll();
    }


    findCountries(): Promise<object[]> {
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
        const promise1 = promise.then(m => {
                return m.map(x => {
                    console.log('In model mapping lambda: x.name = ', x.name);
                    console.log('In model mapping lambda: x.winetypeModel.sv = ', x.winetypeModel.sv);
                    //return x;
                    return {
                        name: x.name,
                        systembolaget: x.systembolaget,
                        winetype: x.winetypeModel.sv,
                        country: x.countryModel.name,
                        volume: x.volume,
                    };
                });
            }
        );
        return promise1;
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

    postCountry(country) {
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

    patchGrape(from: any, to: any) {

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
}
