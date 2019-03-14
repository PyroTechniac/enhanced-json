import * as fse from 'fs-nextra';
import { resolve } from 'path';
import Util from './util/Util';
export default class AtomicJson {
    private directory: string;
    private _ready: boolean;
    constructor(directory: string) {
        this._ready = false;
        this.directory = resolve(directory);
        this.init();
    }
    private async init(): Promise<void> {
        await fse.ensureDir(this.directory).then(() => this._ready = true).catch((err: Error) => { throw err; });
    }
    public hasTable(table: string): Promise<boolean> {
        return fse.pathExists(resolve(this.directory, table));
    }
    public createTable(table: string) {
        return fse.ensureDir(resolve(this.directory, table));
    }
    public deleteTable(table: string): Promise<void> {
        return this.hasTable(table)
            .then((exists: boolean) => exists ? fse.emptyDir(resolve(this.directory, table)).then(() => fse.remove(resolve(this.directory, table))) : null);
    }
    public async getAll(table: string, entries: string[]): Promise<object[]> {
        if (!Array.isArray(entries) || !entries.length) entries = await this.getKeys(table);
        if (entries.length < 5000) {
            return Promise.all(entries.map(this.get.bind(this, table)));
        }
        const chunks = Util.chunk(entries, 5000);
        const output = [];
        for (const chunk of chunks) output.push(...await Promise.all(chunk.map(this.get.bind(this, table))));
        return output;
    }
    public get(table: string, id: string): Promise<object | null> {
        return fse.readJSON(resolve(this.directory, table, `${id}.json`)).catch(() => null);
    }
    public has(table: string, id: string): Promise<boolean> {
        return fse.pathExists(resolve(this.directory, table, `${id}.json`));
    }
    public getRandom(table: string) {
        return this.getKeys(table).then((data: any) => this.get(table, data[Math.floor(Math.random() * data.length)]));
    }
    public create(table: string, document: string, data: object = {}): Promise<void> {
        return fse.outputJSONAtomic(resolve(this.directory, table, `${document}.json`), { id: document, ...data });
    }
    public async update(table: string, document: string, data: object): Promise<void> {
        const existent = await this.get(table, document);
        return fse.outputJSONAtomic(resolve(this.directory, table, `${document}.json`), Util.mergeObjects(existent || { id: document }, this.parseUpdateInput(data)));
    }
    public replace(table: string, document: string, data: object): Promise<void> {
        return fse.outputJSONAtomic(resolve(this.directory, table, `${document}.json`), { id: document, ...this.parseUpdateInput(data) });
    }
    public delete(table: string, document: string): Promise<void> {
        return fse.unlink(resolve(this.directory, table, `${document}.id`));
    }
    public async getKeys(table: string): Promise<string[]> {
        const dir = resolve(this.directory, table);
        const filenames: string[] = await fse.readdir(dir);
        const files: string[] = [];
        for (const filename of filenames) {
            if (filename.endsWith('.json')) files.push(filename.slice(0, filename.length - 5));
        }
        return files;
    }
    protected parseUpdateInput(updated: any) {
        if (Util.isObject(updated)) return updated;
        const updatedObject = {};
        for (const entry of updated) Util.mergeObjects(updatedObject, Util.makeObject(entry.data[0], entry.data[1]));
        return updatedObject;
    }
}