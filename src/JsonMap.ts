import { CustomError } from 'advancedts';
import AtomicJson from './AtomicJson';
import { MapInterface } from './Interfaces';
export default class JsonMap {
    private database: AtomicJson;
    private map: MapInterface;
    constructor(directory: string) {
        this.map = new Map();
        this.database = new AtomicJson(directory);
    }

    public async set(key, value, table) {
        if (!this.database.hasTable(table)) await this.database.createTable(table);
        if (!this.database.has(table, key)) {
            await this.database.create(table, key, value);
        } else {
            await this.database.update(table, key, value);
        }
        return this.map.set(key, value);
    }
    public async get(key: string, table: string): Promise<object> {
        const dbEntry = await this.database.get(table, key);
        if (this.map.get(key) !== dbEntry) throw new CustomError('JSON Entry has been modified directly, please import before getting', 'JsonMapInvalidError');
        return dbEntry;
    }
    public async import(): Promise<MapInterface> {
        const tables = await this.database.getTables();
        tables.forEach(async (table) => {
            const keys = await this.database.getKeys(table);
            keys.forEach(async (key) => {
                const entry = await this.database.get(table, key);
                this.set(key, entry, table);
            });
        });
        return this.map;
    }
}