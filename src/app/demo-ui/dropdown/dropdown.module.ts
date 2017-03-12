import {NgModule} from '@angular/core';
import {RuiDropdownModule} from '../../rui/dropdown/dropdown.module';
import {DropdownComponent} from './dropdown.component';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
    imports: [BrowserModule, RuiDropdownModule],
    declarations: [DropdownComponent],
    exports: [DropdownComponent]
})
export class DropdownModule {

}
