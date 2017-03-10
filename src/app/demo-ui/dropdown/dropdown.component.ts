import {Component, forwardRef, Input, TemplateRef, ContentChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    selector: 'dropdown',
    templateUrl: './dropdown.html',
    styleUrls: ['./dropdown.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropdownComponent),
            multi: true
        }
    ]
})
export class DropdownComponent implements ControlValueAccessor {

    @Input() items: any[];

    @Input() set value(newValue: string) {
        if (this.valueChange) {
            this.valueChange(newValue);
        }
    }
    valueChange: Function;
    valueTouched: Function;

    @ContentChild(TemplateRef) itemTemplate: any;

    writeValue(obj: any): void {
        this.value = obj;
    }

    registerOnChange(fn: Function): void {
        this.valueChange = fn
    }

    registerOnTouched(fn: Function): void {
        this.valueTouched = fn;
    }
}