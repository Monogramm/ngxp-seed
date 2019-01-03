import { NgModule } from '@angular/core';

import { WorkerService } from './worker.service';
import { AuthService } from './auth.service';
import { BackendService } from './backend.service';
import { StorageService } from './storage.service';
import { LocalDatabaseService } from './local-database.service';
import { UtilityService } from './utility.service';

@NgModule({
    providers: [
        WorkerService,
        AuthService,
        BackendService,
        StorageService,
        LocalDatabaseService,
        UtilityService
    ],
})
export class CoreModule { }
