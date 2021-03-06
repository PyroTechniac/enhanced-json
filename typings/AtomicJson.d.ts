export default class AtomicJson {
    private directory;
    constructor(directory: string);
    private init;
    hasTable(table: string): Promise<boolean>;
    createTable(table: string): Promise<void>;
    deleteTable(table: string): Promise<void>;
    getTables(): Promise<string[]>;
    getAll(table: string, entries: string[]): Promise<object[]>;
    get(table: string, id: string): Promise<object | null>;
    has(table: string, id: string): Promise<boolean>;
    getRandom(table: string): Promise<object>;
    create(table: string, document: string, data?: object): Promise<void>;
    update(table: string, document: string, data: object): Promise<void>;
    replace(table: string, document: string, data: object): Promise<void>;
    delete(table: string, document: string): Promise<void>;
    getKeys(table: string): Promise<string[]>;
    protected parseUpdateInput(updated: any): any;
}
