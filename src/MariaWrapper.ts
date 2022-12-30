import {SqlWrapper} from "./SqlWrapper";
import {Pool, PoolConnection} from "mariadb";

export class MariaWrapper implements SqlWrapper {
    private connection: Promise<PoolConnection>;

    constructor(pool: Pool) {

        this.connection = pool.getConnection();
    }


    query(sql: string): Promise<any> {
        return this.connection
            .then((c) => {
                return c.query(sql);
            });

    }

    end(): Promise<void> {
        return Promise.resolve(undefined);
    }

}