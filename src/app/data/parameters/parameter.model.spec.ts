import 'reflect-metadata';
import { Parameter } from './parameter.model';

declare var describe: any;
declare var expect: any;
declare var it: any;

describe('Parameter', function () {
    const parameter = new Parameter(null, 'God', 'everything', null, 'answer');

    it('Should create Parameter', function () {
        expect(parameter).toBeTruthy();
    });
});
