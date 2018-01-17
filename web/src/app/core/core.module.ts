import { NgModule } from '@angular/core';

import { WorkerService, BackendService, StorageService } from '../../x-shared/app/core';

import { WebWorkerService } from './web-worker.service';
import { WebBackendService } from './web-backend.service';
import { LocalStorageService } from './local-storage.service';
import { LocalDatabaseService } from '../../x-shared/app/core/local-database.service';
import { UtilityService } from './utility.service';

@NgModule({
    providers: [
        WebWorkerService,
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
