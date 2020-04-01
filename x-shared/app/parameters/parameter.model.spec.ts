import 'reflect-metadata';
import { Parameter } from './parameter.model';

declare let describe: any;
declare let expect: any;
declare let it: any;

describe('Parameter', function () {
    let parameter = new Parameter(null, 'God', 'everything', null, 'answer');

    it('Should create Parameter', function () {
        expect(parameter).toBeTruthy();
    });
});
