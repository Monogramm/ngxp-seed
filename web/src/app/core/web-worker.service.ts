import { Injectable, NgZone } from '@angular/core';

import { WorkerService } from '@xapp/core';

@Injectable()
export class WebWorkerService extends WorkerService {
    constructor(private zone: NgZone) {
        super();
    }

    run(task: () => any): any {
        // Make sure all updates are published inside NgZone so that change detection is triggered if needed
        return this.zone.run(task);
    }

}
