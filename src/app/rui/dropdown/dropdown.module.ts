import {NgModule} from '@angular/core';
import {
    RuiDropdownDirective
} from './dropdown.directive';
import {RuiInputDirective} from './input.directive';
import {RuiToggleDirective} from './toggle.directive';
import {RuiMenuDirective} from './menu.directive';
import {RuiItemDirective} from './item.directive';

@NgModule({
    declarations: [
        RuiDropdownDirective,
        RuiInputDirective,
        RuiToggleDirective,
        RuiMenuDirective,
        RuiItemDirective
    ],
    exports: [
        RuiDropdownDirective,
        RuiInputDirective,
        RuiToggleDirective,
        RuiMenuDirective,
        RuiItemDirective
    ]
})
export class RuiDropdownModule {
}
