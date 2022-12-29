import {SqlWrapper} from "./SqlWrapper";
import {Pool, PoolConnection} from "mariadb";

export class MariaWrapper implements SqlWrapper {
    private connection: Promise<PoolConnection>;

    constructor(pool: Pool) {

        this.connection = pool.getConnection();
    }


    query(sql: string): Promise<any> {
        let x;
        this.connection
            .then((c) => {
                x =  c.query(sql);
            });
        return x;
    }

    end(): Promise<void> {
        return Promise.resolve(undefined);
    }

}