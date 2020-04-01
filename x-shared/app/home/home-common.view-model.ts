import { Injectable } from '@angular/core';

import { HomeService, HomeModule } from './home.service';

@Injectable()
export class HomeCommonViewModel {

    availablePages: HomeModule[];

    isReady = false;

    constructor(private homeService: HomeService) {
        this.init();
    }

    private init() {
        this.availablePages = this.homeService.loadModules();

        this.isReady = true;
    }

}
