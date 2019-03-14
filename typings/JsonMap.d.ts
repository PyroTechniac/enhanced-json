import { MapInterface } from './Interfaces';
export default class JsonMap {
    private database;
    private map;
    constructor(directory: string);
    set(key: any, value: any, table: any): Promise<MapInterface>;
    get(key: string, table: string): Promise<object>;
    import(): Promise<MapInterface>;
}
