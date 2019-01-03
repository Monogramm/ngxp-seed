import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ActivityIndicator } from '../components';

@NgModule({
    exports: [
        CommonModule, FormsModule,
        ActivityIndicator
    ],
    declarations: [
        ActivityIndicator
    ]
})
export class SharedModule { }
