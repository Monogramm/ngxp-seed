import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

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
    @Output() ready = new EventEmitter();

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
        this.roleService.load()
            .then(
                () => {
                    // Make sure all updates are published inside NgZone so that change detection is triggered if needed
                    this.worker.run(() => {
                        this.roles = this.roleService.items.getValue();
                        // must emit a *new* value (immutability!)
                        this.items.next([...this.roles]);
                        this.ready.emit('Roles loaded');
                    });
                },
                (error: Response) => {
                    this.worker.run(() => {
                        this.roles = [];
                        this.items.next([...this.roles]);
                        this.items.error(error);
                        this.ready.emit('Roles NOT loaded');
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
