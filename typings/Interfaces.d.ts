export interface MapInterface {
    set(key: string, value: object): MapInterface;
    delete(key: string): boolean;
    size: number;
    clear(): void;
    entries(): Iterable<[any, any]>;
    forEach(fn: (value: any, key: any, map: Map<any, any>) => void, thisArg: any): void;
    get(key: string): object;
    has(key: string): boolean;
}
