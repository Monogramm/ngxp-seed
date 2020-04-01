import { NgModule } from '@angular/core';

import { WorkerService, AuthService, BackendService, StorageService } from '@xapp/core';

import { WebWorkerService } from './web-worker.service';
import { WebBackendService } from './web-backend.service';
import { LocalStorageService } from './local-storage.service';
import { LocalDatabaseService } from '@xapp/core/local-database.service';
import { UtilityService } from './utility.service';

@NgModule({
    providers: [
        WebWorkerService,
        AuthService,
        WebBackendService,
        LocalStorageService,
        LocalDatabaseService,
        UtilityService,
        { provide: WorkerService, useExisting: WebWorkerService },
        { provide: BackendService, useExisting: WebBackendService },
        { provide: StorageService, useExisting: LocalStorageService }
    ],
})
export class CoreModule { }
