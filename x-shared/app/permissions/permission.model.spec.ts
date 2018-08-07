import 'reflect-metadata';
import { Permission } from './permission.model';

declare var describe: any;
declare var expect: any;
declare var it: any;

describe('Permission', function () {
    let permission = new Permission('42', 'answer');


    it('Should create Permission', function () {
        expect(permission).toBeTruthy();
    });
});
