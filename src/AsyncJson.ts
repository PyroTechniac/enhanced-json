import * as fse from 'fs-nextra';
import { resolve } from 'path';
import Util from './util/Util';
export default class AsyncJson {
    private directory: string;
    constructor(directory: string) {
        this.directory = directory;
        this.init();
    }
    private async init(): Promise<void> {
        await fse.ensureDir(this.directory).catch((err: Error) => { throw err; });
    }
    public hasTable(table: string): Promise<boolean> {
        return fse.pathExists(resolve(this.directory, table));
    }
    public createTable(table: string) {
        return fse.mkdir(resolve(this.directory, table));
    }
    public async deleteTable(table: string): Promise<void> {
        const exists = await this.hasTable(table);
        return await (exists ? fse.emptyDir(resolve(this.directory, table)).then(() => fse.remove(resolve(this.directory, table))) : null);
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
    public async get(table: string, id: string): Promise<object | null> {
        try {
            return fse.readJSON(resolve(this.directory, table, `${id}.json`));
        } catch (e) {
            return null;
        }
    }
    public has(table: string, id: string): Promise<boolean> {
        return fse.pathExists(resolve(this.directory, table, `${id}.json`));
    }
    public async getRandom(table: string) {
        const data = await this.getKeys(table);
        return await this.get(table, data[Math.floor(Math.random() * data.length)]);
    }
    public create(table: string, document: string, data: object = {}): Promise<void> {
        return fse.outputJSONAtomic(resolve(this.directory, table, `${document}.json`), { id: document, ...data });
    }
    public async update(table: string, document: string, data: string): Promise<void> {
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