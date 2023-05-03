import {app, setupEndpoints} from './backend';
import {Options} from "sequelize";

const mariaDbOptions : Options = {
    dialect: 'mariadb',
    dialectOptions: {
        user: 'root',
        // password: 'root1234',
        // host: 'localhost',
        port: 3307,
        connectionLimit: 5
        // Your mariadb options here
        // connectTimeout: 1000
    }
};

setupEndpoints(app, mariaDbOptions);

app.listen(3000, () => {
    console.log('app is running @3000, from backendMain.ts');
});
