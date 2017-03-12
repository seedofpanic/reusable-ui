import {NgModule} from '@angular/core';
import {
    RuiDropdownDirective
} from './dropdown.directive';
import {RuiInputDirective} from './input.directive';
import {RuiToggleDirective} from './toggle.directive';
import {RuiMenuDirective} from './menu.directive';
import {RuiItemDirective} from './item.directive';
import {RuiFocusableDirective} from './focusable.dierctive';

@NgModule({
    declarations: [
        RuiDropdownDirective,
        RuiInputDirective,
        RuiToggleDirective,
        RuiMenuDirective,
        RuiItemDirective,
        RuiFocusableDirective
    ],
    exports: [
        RuiDropdownDirective,
        RuiInputDirective,
        RuiToggleDirective,
        RuiMenuDirective,
        RuiItemDirective,
        RuiFocusableDirective
    ]
})
export class RuiDropdownModule {
}