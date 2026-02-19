import {app, setupEndpoints} from './backendRouting';
import {Options} from "sequelize";

const mariaDbOptions : Options = {
    dialect: 'mariadb',
    host: '127.0.0.1',
    port: 3307,
    pool: {
        max: 5
    }
};

setupEndpoints(app, mariaDbOptions);

app.listen(3000, () => {
    console.log('app is running @3000, from backendMain.ts');
});
