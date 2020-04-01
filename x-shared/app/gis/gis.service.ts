import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

import { WorkerService, BackendService } from '../core';
import { Logger, Pagination } from '../shared';

import { GisLocation } from './gis.model';

/**
 * Geolocation Information System (GIS) Service.
 */
@Injectable()
export class GisService {
    private basePath = 'https://nominatim.openstreetmap.org/search/';

    items: BehaviorSubject<Array<GisLocation>> = new BehaviorSubject([]);

    private _allItems: Array<GisLocation> = [];

    constructor(private backendService: BackendService, private worker: WorkerService) {
    }

    load(address: string, pagination?: Pagination) {
        if (Logger.isEnabled) {
            Logger.log('loading locations...');
        }
        this._allItems.length = 0;

        let url: string = this.basePath;
        url += encodeURI(address);
        url += '?format=json';

        return this.backendService.load(new URL(url), pagination)
            .then(response => {
                if (Logger.isEnabled) {
                    Logger.log('response = ');
                    Logger.dir(response);
                }

                const newItems: any[] = [];
                const data: any[] = response.body;
                data.forEach((rawEntry) => {
                  const newEntry = this.newModel(rawEntry);

                  newItems.push(newEntry);
                });
                this._allItems.push(...newItems);

                this.publishUpdates();

                return newItems;
            });
    }

    get count(): number {
        return this._allItems.length;
    }

    public newModel(data?: any): GisLocation {
        return new GisLocation(
            data.lat,
            data.lon,
            data.boundingbox || [],
            data.osm_type || null,
            data.osm_id || null,
            data.place_id || null,
            data.licence || null,
            data.display_name || null,
            data.class || null,
            data.type || null,
            data.importance || null,
        );
    }

    private publishUpdates() {
        // Make sure all updates are published inside NgZone so that change detection is triggered if needed
        this.worker.run(() => {
            // must emit a *new* value (immutability!)
            this.items.next([...this._allItems]);
        });
    }
}
