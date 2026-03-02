import {app, setupEndpoints} from './backendRouting';
import {Options} from "sequelize";
import {Orm} from "./orm";

const mariaDbOptions : Options = {
    dialect: 'mariadb',
    host: '127.0.0.1',
    port: 3307,
    pool: {
        max: 5
    },
    logging: false, // false = no logging by Sequelize.
};

const orm = new Orm('hartappat', 'appuser', 'appuserpass', mariaDbOptions);
setupEndpoints(app, orm);

app.listen(3000, () => {
    console.log('app is running @3000, from backendMain.ts');
});
