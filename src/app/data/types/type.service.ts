import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { WorkerService, BackendService } from '../../core';
import { Logger, Pagination } from '../../shared';
import { Type, TypeDTO } from './type.model';

@Injectable()
export class TypeService {
  private readonly basePath = 'types';

  items: BehaviorSubject<Array<Type>> = new BehaviorSubject([]);

  private _allItems: Array<Type> = [];

  constructor(private backendService: BackendService,
    private worker: WorkerService) {
  }

  load(pagination?: Pagination) {
    if (Logger.isEnabled) {
      Logger.log('loading types...');
    }
    this._allItems.length = 0;

    return this.backendService.load<TypeDTO>(this.basePath, pagination)
      .then(
        (response: HttpResponse<TypeDTO[]>) => {
          if (Logger.isEnabled) {
            Logger.log('response = ');
            Logger.dir(response);
          }

          const newItems: Type[] = [];
          const data: TypeDTO[] = response.body;
          data.forEach((rawEntry) => {
            const newEntry = this.newModel(rawEntry);

            newItems.push(newEntry);
          });
          this._allItems.push(...newItems);

          this.publishUpdates();

          return newItems;
        },
        (error: any) => {
          if (Logger.isEnabled) {
            Logger.log('Types not loaded');
          }
          this.publishUpdates();
          return Promise.reject(error);
        }
      );
  }

  get(id: string) {
    if (Logger.isEnabled) {
      Logger.log('retrieving a type = ' + id);
    }

    return this.backendService
      .getById<TypeDTO>(this.basePath, id);
  }

  get count(): number {
    return this._allItems.length;
  }

  add(typeToAdd: string | Type | TypeDTO) {
    const now = new Date();
    let type: TypeDTO;
    if (typeof typeToAdd === 'string') {
      type = new TypeDTO(
        null,
        typeToAdd,
        now,
        this.backendService.userId,
        now,
        this.backendService.userId,
        this.backendService.userId
      );
    } else if (typeToAdd instanceof Type) {
      type = new TypeDTO(
        null,
        typeToAdd.name,
        now,
        this.backendService.userId,
        now,
        this.backendService.userId,
        typeToAdd.owner || this.backendService.userId
      );
    } else {
      type = typeToAdd;
    }
    const body = JSON.stringify(type);

    if (Logger.isEnabled) {
      Logger.log('adding a type = ' + body);
    }

    return this.backendService.push<TypeDTO>(
      this.basePath, body
    )
      .then((response: HttpResponse<TypeDTO>) => {
        if (Logger.isEnabled) {
          Logger.log('response = ');
          Logger.dir(response);
        }

        let data: TypeDTO;
        if (Array.isArray(response.body)) {
          data = response.body[0];
        } else {
          data = response.body;
        }

        const newEntry = this.newModel(data);

        this._allItems.unshift(newEntry);

        this.publishUpdates();
      });
  }

  update(type: Type) {
    if (Logger.isEnabled) {
      Logger.log('updating a type = ' + type);
    }

    return this.backendService.set<TypeDTO>(
      this.basePath, type.id, type
    )
      .then(res => {
        this.publishUpdates();
      });
  }

  updateSelection(selected: boolean) {
    const indeces: string[] = [];
    this._allItems.forEach((type) => {
      type.selected = selected;
    });
    this.publishUpdates();
  }

  delete(type: Type) {
    if (Logger.isEnabled) {
      Logger.log('deleting a type = ' + type.name);
    }

    return this.backendService
      .remove(
        this.basePath, type.id
      )
      .then(res => {
        const index = this._allItems.indexOf(type);
        this._allItems.splice(index, 1);
        this.publishUpdates();
      });
  }

  deleteSelection() {
    const indeces: string[] = [];
    this._allItems.forEach((type) => {
      if (type.selected) {
        indeces.push(type.id);
      }
    });
    if (indeces.length === 0) {
      return null;
    }

    return this.backendService.removeAll(
      this.basePath, indeces
    )
      .then(res => {
        this._allItems.forEach((type) => {
          if (type.selected) {
            const index = this._allItems.indexOf(type);
            this._allItems.splice(index, 1);
            type.selected = false;
          }
        });
        this.publishUpdates();
      });
  }

  public newModel(data?: any): Type {
    return new Type(
      data.id || null,
      data.name,
      data.selected || false,
      data.deleted || false,
      data.deleting || false,
      data.createdAt ? new Date(data.createdAt) : null,
      data.createdBy || null,
      data.modifiedAt ? new Date(data.modifiedAt) : null,
      data.modifiedBy || null,
      data.owner || null
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
