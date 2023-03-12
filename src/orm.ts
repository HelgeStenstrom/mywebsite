import {Model, Optional, QueryTypes, Sequelize} from 'sequelize';

export class Orm {


    sequelize: Sequelize;

    tryMe(): string {
        const promise = this.sequelize.authenticate();
        promise.then( x => console.log('maybe i am authenticated', x));
        // const promise1 = this.sequelize.query("SELECT * from hartappat.grapes");
        // promise1.then(x => console.log('Found this: ', x));
        return "tryme: I'm fine";
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
        this.tryMe();
    }

    querySelect(): Promise<object[]> {
        console.log('In Orm.query()');
        // See https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-method-query
        const promise = this.sequelize.query("SELECT * from hartappat.grapes",
            {type: QueryTypes.SELECT});
        return promise;
    }


    async end() {
        return Promise.resolve(undefined);
    }
}
