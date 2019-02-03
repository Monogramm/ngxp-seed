import { TestBed, async } from '@angular/core/testing';

import { BackendService } from '../../core';
import { FakeBackendService } from '../../core/testing';
import { HomeService } from './home.service';
import { HOME } from './testing/home.mock';

let homeService: HomeService;
let backendService: FakeBackendService;
let loadModulesSpy: jasmine.Spy;

describe('HomeService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HomeService,
        { provide: BackendService, useClass: FakeBackendService }
      ]
    });

    backendService = TestBed.get(BackendService);
    homeService = TestBed.get(HomeService);
    loadModulesSpy = spyOn(backendService, 'isLoggedIn').and
      .returnValue(false);
  });

  /*
  it('should return promise of list of homes', async(() => {
    homeService.get().then((lstModules: any[]) => {
      expect(lstModules.length).toEqual(HOME.length);
    });
  }));

  it('should reject promise with error in case of any issue with api',
    async(() => {
      loadModulesSpy.and.returnValue(Promise.reject('Some error occurred'));
      homeService.get().then(null, (error) => {
        expect(error).toBeDefined();
      });
    }));

  it('should return cached homes if available in cache', async(() => {
    homeService.get().then(() => {
      homeService.get().then((lstModules: any[]) => {
        expect(lstModules.length).toEqual(HOME.length);
        expect(loadModulesSpy.calls.count()).toBe(1);
      });
    });
  }));

  it('should return home by id', async(() => {
    homeService.getAuthorById(HOME[0].id).then((oAuthor) => {
      expect(oAuthor).toEqual(HOME[0]);
    });
  }));

  it('should return home name by id', async(() => {
    homeService.getNameById(HOME[0].id).then((homeName) => {
      expect(homeName).toBe(HOME[0].name);
    });
  }));
  */

});
