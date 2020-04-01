import 'reflect-metadata';
import { Type } from './type.model';

declare let describe: any;
declare let expect: any;
declare let it: any;

describe('Type', function () {
    let type = new Type('42', 'answer');


    it('Should create Type', function () {
        expect(type).toBeTruthy();
    });
});
