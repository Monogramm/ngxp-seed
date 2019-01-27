import 'reflect-metadata';
import { Media } from './media.model';

declare var describe: any;
declare var expect: any;
declare var it: any;

describe('Media', function () {
    let media = new Media('God', 'answer', ['EVERYTHING_CREATE', 'EVERYTHING_READ', 'EVERYTHING_UPDATE', 'EVERYTHING_DELETE',]);

    it('Should create Media', function () {
        expect(media).toBeTruthy();
    });
});
