import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';

import { HomeCommonViewModel } from './home-common.view-model';
import { HomeService } from './home.service';
import { HOME, FakeHomeService } from './testing';

let homeCommonVM: HomeCommonViewModel;

describe('HomeCommonVM', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                HomeCommonViewModel,
                { provide: HomeService, useClass: FakeHomeService }
            ]
        });

        homeCommonVM = TestBed.get(HomeCommonViewModel);

    });

    /*
    it('availablePages should be blank array', () => {
        expect(homeCommonVM.availablePages).toEqual(HOME);
    });
      it('authors$ should be defined', () => {
        expect(homeCommonVM.authors$).toBeDefined();
      });

      it('#loadAuthorList should load authors', fakeAsync(() => {
        homeCommonVM.loadAuthorList();
        tick();
        expect(homeCommonVM.availablePages.length).toBeGreaterThan(0);
      }));

      it('#loadAuthorList should emit loaded authors', fakeAsync(() => {
        homeCommonVM.loadAuthorList();
        tick();
        homeCommonVM.authors$.subscribe((availablePages) => {
          expect(availablePages.length).toBeGreaterThan(0);
        });
      }));
    */
});
