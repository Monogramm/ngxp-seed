import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { ActivityIndicatorComponent, PaginationControlsComponent } from '../components';

@NgModule({
    exports: [
        CommonModule, FormsModule,
        TranslateModule,
        ActivityIndicatorComponent,
        PaginationControlsComponent
    ],
    declarations: [
        ActivityIndicatorComponent,
        PaginationControlsComponent
    ]
})
export class SharedModule { }
