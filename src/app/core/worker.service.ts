import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class WorkerService {
    constructor(private zone: NgZone) {
    }

    run(task: () => any): any {
        // Make sure all updates are published inside NgZone so that change detection is triggered if needed
        return this.zone.run(task);
    }

}
