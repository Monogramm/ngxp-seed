import 'reflect-metadata';
import { Permission } from './permission.model';

declare let describe: any;
declare let expect: any;
declare let it: any;

describe('Permission', function () {
    let permission = new Permission('42', 'answer');


    it('Should create Permission', function () {
        expect(permission).toBeTruthy();
    });
});
