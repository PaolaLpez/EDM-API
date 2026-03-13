import { createConnection } from 'mysql2';

export const mysqlProvider = [{
    provide: 'MYSQL_CONNECTION',
    useFactory: async () => {
        const connnection = createConnection({
            host: 'localhost',
            port: 3306,
            user: 'admin',
            password: 'admin123',
            database: 'gids6082_bd'
        });
        return connnection;

    }

}]