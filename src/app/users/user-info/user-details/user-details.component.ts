import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { WorkerService } from '../../../core';

import { Logger } from '../../../shared';
import { LoginService, Role, RoleService, User, UserService } from '../../../data';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent implements OnInit {
  @Input() user: User;

  busy = false;
  rolesAvailable = true;

  private items: BehaviorSubject<Array<Role>> = new BehaviorSubject([]);
  roles: Array<Role>;

  constructor(
    public store: UserService,
    public roleService: RoleService,
    public loginService: LoginService,
    private worker: WorkerService,
    private _translate: TranslateService) {
  }

  ngOnInit() {
    this.busy = true;
    this.roleService.load()
      .then(
        () => {
          this.busy = false;
          // Make sure all updates are published inside NgZone so that change detection is triggered if needed
          this.worker.run(() => {
            this.roles = this.roleService.items.getValue();
            // must emit a *new* value (immutability!)
            this.items.next([...this.roles]);
            this.rolesAvailable = (this.roles.length > 0);
          });
        },
        (error: HttpErrorResponse) => {
          this.busy = false;
          this.worker.run(() => {
            this.roles = [];
            this.items.next([...this.roles]);
            this.rolesAvailable = false;
          });
        }
      );
  }

  sendToken() {
    if (this.user.email) {
      this.loginService.sendVerificationToken(this.user.email)
        .then(
          () => {
            const msg: string = this._translate.instant('register.message.success.token_sent');
            alert(msg);
          },
          (error) => {
            if (Logger.isEnabled) {
              Logger.dir(error);
            }
            const msg: string = this._translate.instant('register.message.error.send_token');
            alert(msg);
          }
        );
    }
  }
}
