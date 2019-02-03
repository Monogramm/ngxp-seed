import 'reflect-metadata';
import { Type } from './type.model';

declare var describe: any;
declare var expect: any;
declare var it: any;

describe('Type', function () {
    const type = new Type('42', 'answer');


    it('Should create Type', function () {
        expect(type).toBeTruthy();
    });
});
