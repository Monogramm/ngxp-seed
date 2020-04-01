import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { WorkerService, BackendService } from '../core';
import { Logger, Pagination } from '../shared';
import { User, UserDTO } from './user.model';

@Injectable()
export class UserService {
  private basePath = 'users';

  items: BehaviorSubject<Array<User>> = new BehaviorSubject([]);

  private _allItems: Array<User> = [];

  constructor(private backendService: BackendService, private worker: WorkerService) {
  }

  load(pagination?: Pagination) {
    if (Logger.isEnabled) {
      Logger.log('loading users...');
    }
    this._allItems.length = 0;

    return this.backendService.load(this.basePath, pagination)
      .then((response: HttpResponse<UserDTO[]>) => {
        if (Logger.isEnabled) {
          Logger.log('response = ');
          Logger.dir(response);
        }

        const newItems: User[] = [];
        const data: UserDTO[] = response.body;
        data.forEach((rawEntry) => {
          const newEntry = this.newModel(rawEntry);

          newItems.push(newEntry);
        });
        this._allItems.push(...newItems);

        this.publishUpdates();

        return newItems;
      },
        (error: Promise<Response>) => {
          if (Logger.isEnabled) {
            Logger.log('Users not loaded');
          }
          this.publishUpdates();
          // return Promise.reject(error);
        }
      );
  }

  get(id: string) {
    if (Logger.isEnabled) {
      Logger.log('retrieving a user = ' + id);
    }

    return this.backendService
      .getById(this.basePath, id);
  }

  get count(): number {
    return this._allItems.length;
  }

  add(userToAdd: User | UserDTO) {
    const now: Date = new Date();
    let user: UserDTO;
    if (userToAdd instanceof User) {
      user = new UserDTO(
        null,
        userToAdd.email,
        userToAdd.password,
        userToAdd.username,
        false,
        false,
        userToAdd.role,
        now,
        this.backendService.userId,
        now,
        this.backendService.userId,
        userToAdd.owner || this.backendService.userId
      );
    } else {
      user = userToAdd;
    }

    const body = JSON.stringify(user);

    if (Logger.isEnabled) {
      Logger.log('registering in user = ' + body);
    }

    return this.backendService.push(
      this.basePath, body
    );
  }

  update(user: User) {
    if (Logger.isEnabled) {
      Logger.log('updating a user = ' + user);
    }

    return this.backendService.set(
      this.basePath, user.id, user
    )
      .then(res => {
        this.publishUpdates();
      });
  }

  delete(user: User) {
    if (Logger.isEnabled) {
      Logger.log('deleting a user = ' + user);
    }

    return this.backendService
      .remove(
        this.basePath, user.id
      )
      .then(res => {
        user.deleted = true;
        user.deleting = false;
        const index = this._allItems.indexOf(user);
        this._allItems.splice(index, 1);
        this.publishUpdates();
      });
  }

  public newModel(data?: any): User {
    return new User(
      data.email,
      undefined,
      data.username,
      data.verified || false,
      data.enabled || false,
      data.role || null,
      data.createdAt ? new Date(data.createdAt) : null,
      data.modifiedAt ? new Date(data.modifiedAt) : null,
      data.createdBy || null,
      data.modifiedBy || null,
      data.owner || null,
      data.id || null
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
