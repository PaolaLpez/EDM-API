import { Client } from 'pg';
export const pgProvider = [{
    provide: 'POSTGRES_CONNECTION',
    useFactory: async () => {
        const client = new Client({
            host: 'localhost',
            port: 5432,
            user: 'admin',
            password: 'qwerty',
            database: 'gids6082_db'
        });
        await client.connect();
        return client;
    }
}]