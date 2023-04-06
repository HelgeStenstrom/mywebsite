import {DataTypes, Model, ModelStatic, Sequelize} from 'sequelize';

export class Orm {


    sequelize: Sequelize;
    private Grape: ModelStatic<Model>;

    testAuthentication(): string {
        const promise = this.sequelize.authenticate();
        promise.then( x => console.log('maybe i am authenticated', x));
        return "testAuthentication: I'm fine";
    }

    constructor() {
        this.sequelize = new Sequelize('hartappat', 'root', 'root1234', {
            dialect: 'mariadb',
            dialectOptions: {
                user: 'root',
                password: 'root1234',
                host: 'localhost',
                port: 3307,
                connectionLimit: 5
                // Your mariadb options here
                // connectTimeout: 1000
            }
        });
        this.testAuthentication();

        this.Grape = this.sequelize.define("grape",
            {
                name: DataTypes.TEXT,
                color:DataTypes.TEXT
            },
            {timestamps: false}
            )
    }

    async end() {
        return Promise.resolve(undefined);
    }


    findGrapes(): Promise<object[]> {

        //console.log('In Orm.findGrapes()');
        // See https://sequelize.org/api/v6/class/src/model.js~model#static-method-findAll
        return this.Grape.findAll(
         //   {attributes: ['name', 'id', 'color'],}   // Not needed if we want all attributes of the table
        );
    }


    postGrape(grape) {

        //console.log(`In Orm.postGrape(${grape.name})`)
        // See https://sequelize.org/api/v6/class/src/model.js~model#static-method-create
        return this.Grape.create(grape);
    }
}
