import { ClassProvider } from '@angular/core';

import { Pagination } from '../../../shared';
import { HomeService } from '../home.service';
import { HOME } from './home.mock';

export { HomeService } from '../home.service';

export class FakeHomeService {

    get(pagination?: Pagination) {
        return Promise.resolve(HOME);
    }

    getModuleByName(moduleName: string) {
        return Promise.resolve(HOME.filter(item => item.text === moduleName)[0]);
    }

    getRouteByName(moduleName: string) {
        return this.getModuleByName(moduleName).then((home) => {
            return home.route;
        });
    }
}

export let fakeHomeServiceProvider: ClassProvider = {
    provide: HomeService,
    useClass: FakeHomeService
};
