import {DataTypes, Model, ModelStatic, Options, Sequelize} from 'sequelize';

export class Orm {


    sequelize: Sequelize;
    private Grape: ModelStatic<Model>;
    private Tasting: ModelStatic<Model>;
    private Country: ModelStatic<Model>;
    private Wine: ModelStatic<Model>;


    testAuthentication(): string {
        const promise = this.sequelize.authenticate();
        promise.then( x => console.log('maybe i am authenticated', x));
        return "testAuthentication: I'm fine";
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
    }


    createTables() {
        return this.sequelize.sync();
    }

    findTastings(): Promise<object[]> {
        return this.Tasting.findAll();
    }

    getTasting(id:number){
        return this.Tasting.findByPk(id);
    }

    findGrapes(): Promise<object[]> {

        //console.log('In Orm.findGrapes()');
        // See https://sequelize.org/api/v6/class/src/model.js~model#static-method-findAll
        return this.Grape.findAll(
         //   {attributes: ['name', 'id', 'color'],}   // Not needed if we want all attributes of the table
        );
    }


    findCountries(): Promise<object[]> {

        //console.log('In Orm.findGrapes()');
        // See https://sequelize.org/api/v6/class/src/model.js~model#static-method-findAll
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
}
