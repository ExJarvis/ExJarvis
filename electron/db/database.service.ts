import "reflect-metadata";
import "regenerator-runtime/runtime.js";
import {Connection, ConnectionOptions, createConnection} from 'typeorm';
import {Settings} from './repositories/settings';
import {Item} from './entities/item.entity';

export class DatabaseService {

    public connection: Promise<Connection>;
    private readonly options: ConnectionOptions;

    constructor() {
        Settings.initialize();
        this.options = {
            type: 'sqlite',
            database: Settings.dbPath,
            entities: [Item],
            synchronize: true,
            logging: 'all',
            // logger: 'simple-console',
        };
        this.connection = createConnection(this.options);
    }
}
