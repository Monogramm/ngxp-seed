import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { ActivityIndicator, PaginationControls } from '../components';

@NgModule({
    exports: [
        CommonModule, FormsModule,
        TranslateModule,
        ActivityIndicator,
        PaginationControls
    ],
    declarations: [
        ActivityIndicator,
        PaginationControls
    ]
})
export class SharedModule { }
