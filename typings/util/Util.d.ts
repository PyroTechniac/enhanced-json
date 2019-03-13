export default class Util {
    static makeObject(path: string, value: any, obj?: object): object;
    static chunk(entries: any[], chunkSize: number): any[];
    static isObject(input: any): boolean;
    static mergeObjects(objTarget: {}, objSource: {
        [x: string]: any;
    }): object;
    constructor();
}
