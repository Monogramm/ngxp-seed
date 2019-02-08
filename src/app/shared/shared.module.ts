import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { ActivityIndicatorComponent, PaginationControlsComponent } from './components';
import { DebounceClickDirective, DebounceKeyUpDirective } from './directives';

@NgModule({
    exports: [
        CommonModule, FormsModule,
        TranslateModule,
        ActivityIndicatorComponent,
        PaginationControlsComponent,
        DebounceClickDirective,
        DebounceKeyUpDirective
    ],
    declarations: [
        ActivityIndicatorComponent,
        PaginationControlsComponent,
        DebounceClickDirective,
        DebounceKeyUpDirective
    ]
})
export class SharedModule { }
