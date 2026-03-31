import {app, setupEndpoints} from './backendRouting';
import {Options} from "sequelize";
import {Orm} from "./orm";
import {devAutoLoginMiddleware} from "./middleware/devAutoLogin";

const mariaDbOptions : Options = {
    dialect: 'mariadb',
    host: '127.0.0.1',
    port: 3307,
    pool: {
        max: 5
    },
    logging: false, // false = no logging by Sequelize.
};

async function main(){
    const orm = new Orm('hartappat', 'appuser', 'appuserpass', mariaDbOptions);
    await orm.initialize();

    app.use(devAutoLoginMiddleware(1));

    setupEndpoints(app, orm);

    app.listen(3000, () => {
        console.log('app is running @3000, from backendMain.ts');
    });
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
