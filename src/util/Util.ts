export default class Util {
    public static makeObject(path: string, value: any, obj: object = {}) {
        if (path.indexOf('.') === -1) {
            obj[path] = value;
        } else {
            const route: string[] = path.split('.');
            const lastKey: string = route.pop();
            let reference = obj;
            for (const key of route) {
                if (!reference[key]) reference[key] = {};
                reference = reference[key];
            }
            reference[lastKey] = value;
        }
        return obj;
    }
    public static chunk(entries: any[], chunkSize: number): any[] {
        const clone = entries.slice();
        const chunks = [];
        while (clone.length) chunks.push(clone.splice(0, chunkSize));
        return chunks;
    }
    public static isObject(input: any): boolean {
        return input && input.constructor === Object;
    }
    public static mergeObjects(objTarget = {}, objSource: { [x: string]: any; }): object {
        for (const key in objSource) objTarget[key] = Util.isObject(objSource[key]) ? Util.mergeObjects(objTarget[key], objSource[key]) : objSource[key];
        return objTarget;
    }
    constructor() {
        throw new Error(`The class ${this.constructor.name} cannot be initialized`);
    }
}