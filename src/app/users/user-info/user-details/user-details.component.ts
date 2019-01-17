import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Logger } from '../../../shared';
import { LoginService, User, UserService } from '../../../data';

@Component({
    selector: 'user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsComponent {
    @Input() user: User;

    constructor(
        public store: UserService, 
        public loginService: LoginService,
        private _translate: TranslateService) {
    }

    sendToken() {
        if (this.user.email) {
            this.loginService.sendVerificationToken(this.user.email)
                .then(
                    () => {
                        var msg: string = this._translate.instant('register.message.success.token_sent');
                        alert(msg);
                    },
                    (error) => {
                        if (Logger.isEnabled) {
                            Logger.dir(error);
                        }
                        var msg: string = this._translate.instant('register.message.error.send_token');
                        alert(msg);
                    }
                );
        }
    }
}
