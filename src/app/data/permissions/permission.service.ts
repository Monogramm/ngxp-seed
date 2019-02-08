import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { WorkerService, BackendService } from '../../core';
import { Logger, Pagination } from '../../shared';
import { Permission, PermissionDTO } from './permission.model';

@Injectable()
export class PermissionService {
  private readonly basePath = 'permissions';

  items: BehaviorSubject<Array<Permission>> = new BehaviorSubject([]);

  private _allItems: Array<Permission> = [];

  constructor(private backendService: BackendService, private worker: WorkerService) {
  }

  load(pagination?: Pagination) {
    if (Logger.isEnabled) {
      Logger.log('loading permissions...');
    }
    this._allItems.length = 0;

    return this.backendService.load<PermissionDTO>(this.basePath, pagination)
      .then((response: HttpResponse<PermissionDTO[]>) => {
        if (Logger.isEnabled) {
          Logger.log('response = ');
          Logger.dir(response);
        }

        const newItems: Permission[] = [];
        const data: PermissionDTO[] = response.body;
        data.forEach((rawEntry) => {
          const newEntry = this.newModel(rawEntry);

          newItems.push(newEntry);
        });
        this._allItems.push(...newItems);

        this.publishUpdates();

        return newItems;
      });
  }

  get(id: string) {
    if (Logger.isEnabled) {
      Logger.log('retrieving a permission = ' + id);
    }

    return this.backendService
      .getById<PermissionDTO>(this.basePath, id);
  }

  get count(): number {
    return this._allItems.length;
  }

  add(permissionToAdd: string | Permission | PermissionDTO) {
    const now = new Date();
    let permission: PermissionDTO;
    if (typeof permissionToAdd === 'string') {
      permission = new PermissionDTO(
        null,
        permissionToAdd,
        now,
        this.backendService.userId,
        now,
        this.backendService.userId,
        this.backendService.userId
      );
    } else if (permissionToAdd instanceof Permission) {
      permission = new PermissionDTO(
        null,
        permissionToAdd.name,
        now,
        this.backendService.userId,
        now,
        this.backendService.userId,
        permissionToAdd.owner || this.backendService.userId
      );
    } else {
      permission = permissionToAdd;
    }
    const body = JSON.stringify(permission);

    if (Logger.isEnabled) {
      Logger.log('adding a permission = ' + body);
    }

    return this.backendService.push<PermissionDTO>(
      this.basePath, body
    )
      .then((response: HttpResponse<PermissionDTO>) => {
        if (Logger.isEnabled) {
          Logger.log('response = ');
          Logger.dir(response);
        }

        const data: PermissionDTO = response.body;
        const newEntry = this.newModel(data);

        this._allItems.unshift(newEntry);

        this.publishUpdates();
      });
  }

  update(permission: Permission) {
    if (Logger.isEnabled) {
      Logger.log('updating a permission = ' + permission);
    }

    return this.backendService.set(
      this.basePath, permission.id, permission
    )
      .then(res => {
        this.publishUpdates();
      });
  }

  updateSelection(selected: boolean) {
    const indeces: string[] = [];
    this._allItems.forEach((permission) => {
      permission.selected = selected;
    });
    this.publishUpdates();
  }

  delete(permission: Permission) {
    if (Logger.isEnabled) {
      Logger.log('deleting a permission = ' + permission.name);
    }

    return this.backendService
      .remove(
        this.basePath, permission.id
      )
      .then(res => {
        const index = this._allItems.indexOf(permission);
        this._allItems.splice(index, 1);
        this.publishUpdates();
      });
  }

  deleteSelection() {
    const indeces: string[] = [];
    this._allItems.forEach((permission) => {
      if (permission.selected) {
        indeces.push(permission.id);
      }
    });
    if (indeces.length === 0) {
      return null;
    }

    return this.backendService.removeAll(
      this.basePath, indeces
    )
      .then(res => {
        this._allItems.forEach((permission) => {
          if (permission.selected) {
            const index = this._allItems.indexOf(permission);
            this._allItems.splice(index, 1);
            permission.selected = false;
          }
        });
        this.publishUpdates();
      });
  }

  public newModel(data?: any): Permission {
    return new Permission(
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
