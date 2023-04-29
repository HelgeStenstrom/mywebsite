import {DataTypes, Model, ModelStatic, Options, Sequelize} from 'sequelize';

export class Orm {


    sequelize: Sequelize;
    private Grape: ModelStatic<Model>;
    private Tasting: ModelStatic<Model>;
    private Country: ModelStatic<Model>;
    private Wine: ModelStatic<Model>;
    private WineType: ModelStatic<Model>;
    private Member: ModelStatic<Model>;


    testAuthentication(): string {
        const promise = this.sequelize.authenticate();
        promise.then(x => console.log('maybe i am authenticated', x));
        return "testAuthentication: I'm fine";
    }

    constructor(database: string, dbUserName: string, dbPassword: string, options: Options) {
        this.sequelize = new Sequelize(database, dbUserName, dbPassword, options);
        // this.testAuthentication();

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

        this.Country = this.sequelize.define("country",
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

        this.WineType = this.sequelize.define("winetype",
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
                country: DataTypes.TEXT,
                name: DataTypes.TEXT,
                systembolaget: DataTypes.INTEGER,
                volume: DataTypes.INTEGER,
                winetype: DataTypes.TEXT,
            },
            {
                timestamps: false,
                tableName: "wines"
            }
            )
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

    findWines() {
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

    async postWine(param: {
        country: number; name: string; systembolaget: number; volume: number; winetype: number
    }) {
        return this.Wine.create(param);
    }
}
