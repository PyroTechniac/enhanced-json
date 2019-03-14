import * as fse from 'fs-nextra';
import { resolve } from 'path';
import Util from './util/Util';
import * as _ from 'lodash';
import { JsonMapOptions } from './Interfaces';
import { CustomError } from 'advancedts';

const _defineSetting = Symbol('_defineSetting');

export default class JsonMap extends Map {
    constructor(iterable, options: JsonMapOptions = {}) {
        if (typeof iterable === 'string') {
            options.name = iterable;
            iterable = null;
        }
        if (!iterable || typeof iterable[Symbol.iterator] !== 'function') {
            options = iterable || options;
            iterable = null;
        }
        super();
    }
    private [_defineSetting](name, type, writable, defaultValue, value) {
        if (_.isNil(value)) value = defaultValue;
        if (value.constructor.name !== type) {

        }
    }
}