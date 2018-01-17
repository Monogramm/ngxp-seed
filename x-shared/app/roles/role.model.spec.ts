import 'reflect-metadata';
import { Role } from './role.model';

declare var describe: any;
declare var expect: any;
declare var it: any;

describe('Role', function () {
    let role = new Role('God', 'answer');

    it('Should create Role', function () {
        expect(role).toBeTruthy();
    });
});
