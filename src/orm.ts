import {DataTypes, Model, ModelCtor, ModelStatic, Sequelize} from 'sequelize';

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
            })
    }

    findGrapes(): Promise<object[]> {


        console.log('In Orm.query()');
        // See https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-method-query

        return this.Grape.findAll({
            attributes: ['name', 'id', 'color']
        });
    }


    async end() {
        return Promise.resolve(undefined);
    }


}
