import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { ActivityIndicator } from '../components';

@NgModule({
    exports: [
        CommonModule, FormsModule,
        TranslateModule,
        ActivityIndicator
    ],
    declarations: [
        ActivityIndicator
    ]
})
export class SharedModule { }
