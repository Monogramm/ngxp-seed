import 'reflect-metadata';
import { Media } from './media.model';

declare var describe: any;
declare var expect: any;
declare var it: any;

describe('Media', function () {
    const media = new Media('000000', 'answer');

    it('Should create Media', function () {
        expect(media).toBeTruthy();
    });
});
