import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { WorkerService, BackendService } from '../../core';
import { Logger, Pagination } from '../../shared';
import { Role, RoleDTO } from './role.model';

@Injectable()
export class RoleService {
  private readonly basePath = 'roles';

  items: BehaviorSubject<Array<Role>> = new BehaviorSubject([]);

  private _allItems: Array<Role> = [];

  constructor(private backendService: BackendService, private worker: WorkerService) {
  }

  load(pagination?: Pagination) {
    if (Logger.isEnabled) {
      Logger.log('loading roles...');
    }
    this._allItems.length = 0;

    return this.backendService.load<RoleDTO>(this.basePath, pagination)
      .then(
        (response: HttpResponse<RoleDTO[]>) => {
          if (Logger.isEnabled) {
            Logger.log('response = ');
            Logger.dir(response);
          }

          const newItems: Role[] = [];
          const data: RoleDTO[] = response.body;
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
            Logger.log('Roles not loaded');
          }
          this.publishUpdates();
          return Promise.reject(error);
        }
      );
  }

  get(id: string) {
    if (Logger.isEnabled) {
      Logger.log('retrieving a role = ' + id);
    }

    return this.backendService
      .getById<RoleDTO>(this.basePath, id);
  }

  get count(): number {
    return this._allItems.length;
  }

  add(roleToAdd: string | Role | RoleDTO) {
    const now = new Date();
    let role;
    if (typeof roleToAdd === 'string') {
      role = new RoleDTO(
        null,
        roleToAdd,
        null,
        now,
        this.backendService.userId,
        now,
        this.backendService.userId,
        this.backendService.userId
      );
    } else if (roleToAdd instanceof Role) {
      role = new RoleDTO(
        null,
        roleToAdd.name,
        roleToAdd.permissions,
        now,
        this.backendService.userId,
        now,
        this.backendService.userId,
        roleToAdd.owner || this.backendService.userId
      );
    } else {
      role = roleToAdd;
    }
    const body = JSON.stringify(role);

    if (Logger.isEnabled) {
      Logger.log('adding a role = ' + body);
    }

    return this.backendService.push<RoleDTO>(
      this.basePath, body
    )
      .then((response: HttpResponse<RoleDTO>) => {
        if (Logger.isEnabled) {
          Logger.log('response = ');
          Logger.dir(response);
        }

        let data: RoleDTO;
        if (Array.isArray(response.body)) {
          data = response.body[0];
        } else {
          data = response.body;
        }

        const newEntry = this.newModel(data);

        this._allItems.unshift(newEntry);

        this.publishUpdates();
        return newEntry;
      });
  }

  update(role: Role) {
    if (Logger.isEnabled) {
      Logger.log('updating a role = ' + role);
    }

    return this.backendService.set<RoleDTO>(
      this.basePath, role.id, role
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

  delete(role: Role) {
    if (Logger.isEnabled) {
      Logger.log('deleting a role = ' + role.name);
    }

    return this.backendService
      .remove(
        this.basePath, role.id
      )
      .then(res => {
        const index = this._allItems.indexOf(role);
        this._allItems.splice(index, 1);
        this.publishUpdates();
      });
  }

  deleteSelection() {
    const indeces: string[] = [];
    this._allItems.forEach((role) => {
      if (role.selected) {
        indeces.push(role.id);
      }
    });
    if (indeces.length === 0) {
      return null;
    }

    return this.backendService.removeAll(
      this.basePath, indeces
    )
      .then(res => {
        this._allItems.forEach((role) => {
          if (role.selected) {
            const index = this._allItems.indexOf(role);
            this._allItems.splice(index, 1);
            role.selected = false;
          }
        });
        this.publishUpdates();
      });
  }

  public newModel(data?: any): Role {
    return new Role(
      data.id || null,
      data.name,
      data.permissions,
      data.selected || false,
      data.deleted || false,
      data.deleting || false,
      data.createdAt ? new Date(data.createdAt) : null,
      data.createdBy || this.backendService.userId,
      data.modifiedAt ? new Date(data.modifiedAt) : null,
      data.modifiedBy || null,
      data.owner || this.backendService.userId
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
