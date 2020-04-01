import 'reflect-metadata';
import { Role } from './role.model';

declare let describe: any;
declare let expect: any;
declare let it: any;

describe('Role', function () {
    let role = new Role('God', 'answer', ['EVERYTHING_CREATE', 'EVERYTHING_READ', 'EVERYTHING_UPDATE', 'EVERYTHING_DELETE',]);

    it('Should create Role', function () {
        expect(role).toBeTruthy();
    });
});
