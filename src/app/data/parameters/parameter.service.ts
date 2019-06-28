import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { WorkerService, BackendService } from '../../core';
import { Logger, Pagination } from '../../shared';
import { Parameter, ParameterDTO } from './parameter.model';

@Injectable()
export class ParameterService {
  private readonly basePath = 'parameters';

  items: BehaviorSubject<Array<Parameter>> = new BehaviorSubject([]);

  private _allItems: Array<Parameter> = [];

  constructor(private backendService: BackendService, private worker: WorkerService) {
  }

  load(pagination?: Pagination) {
    if (Logger.isEnabled) {
      Logger.log('loading parameters...');
    }
    this._allItems.length = 0;

    return this.backendService.load<ParameterDTO>(this.basePath, pagination)
      .then((response: HttpResponse<ParameterDTO[]>) => {
        if (Logger.isEnabled) {
          Logger.log('response = ');
          Logger.dir(response);
        }

        const newItems: Parameter[] = [];
        const data: ParameterDTO[] = response.body;
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
            Logger.log('Parameters not loaded');
          }
          this.publishUpdates();
          return Promise.reject(error);
        }
      );
  }

  get(id: string) {
    if (Logger.isEnabled) {
      Logger.log('retrieving a parameter = ' + id);
    }

    return this.backendService
      .getById<ParameterDTO>(this.basePath, id);
  }

  get count(): number {
    return this._allItems.length;
  }

  add(parameterToAdd: Parameter | ParameterDTO) {
    const now = new Date();
    let parameter: ParameterDTO;
    if (parameterToAdd instanceof Parameter) {
      parameter = new ParameterDTO(
        null,
        parameterToAdd.name,
        parameterToAdd.description,
        parameterToAdd.type,
        parameterToAdd.value,
        now,
        this.backendService.userId,
        now,
        this.backendService.userId,
        parameterToAdd.owner || this.backendService.userId
      );
    } else {
      parameter = parameterToAdd;
    }
    const body = JSON.stringify(parameter);

    if (Logger.isEnabled) {
      Logger.log('adding a parameter = ' + body);
    }

    return this.backendService.push<ParameterDTO>(
      this.basePath, body
    )
      .then((response: HttpResponse<ParameterDTO>) => {
        if (Logger.isEnabled) {
          Logger.log('response = ');
          Logger.dir(response);
        }

        let data: ParameterDTO;
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

  update(parameter: Parameter) {
    if (Logger.isEnabled) {
      Logger.log('updating a parameter = ' + parameter);
    }

    return this.backendService.set<ParameterDTO>(
      this.basePath, parameter.id, parameter
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

  delete(parameter: Parameter) {
    if (Logger.isEnabled) {
      Logger.log('deleting a parameter = ' + parameter.name);
    }

    return this.backendService
      .remove(
        this.basePath, parameter.id
      )
      .then(res => {
        const index = this._allItems.indexOf(parameter);
        this._allItems.splice(index, 1);
        this.publishUpdates();
      });
  }

  deleteSelection() {
    const indeces: string[] = [];
    this._allItems.forEach((parameter) => {
      if (parameter.selected) {
        indeces.push(parameter.id);
      }
    });
    if (indeces.length === 0) {
      return null;
    }

    return this.backendService.removeAll(
      this.basePath, indeces
    )
      .then(res => {
        this._allItems.forEach((parameter) => {
          if (parameter.selected) {
            const index = this._allItems.indexOf(parameter);
            this._allItems.splice(index, 1);
            parameter.selected = false;
          }
        });
        this.publishUpdates();
      });
  }

  public newModel(data?: any): Parameter {
    return new Parameter(
      data.id || null,
      data.name,
      data.description,
      data.type,
      data.value,
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
