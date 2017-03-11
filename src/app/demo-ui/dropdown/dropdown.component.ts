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

    private _value: string;

    @Input() set value(newValue: string) {
        if (this.valueChange && newValue !== this._value) {
            this.valueChange(newValue);
        }

        this._value = newValue;
    }

    get value() {
        return this._value;
    }

    valueChange: Function;
    valueTouched: Function;

    @ContentChild(TemplateRef) itemTemplate: any;

    test() {
    }

    blur() {
        console.log('blur');
    }

    focus() {
        console.log('focus');
    }

    writeValue(obj: any): void {
        if (obj !== this._value) {
            this.value = obj;
        }
    }

    registerOnChange(fn: Function): void {
        this.valueChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.valueTouched = fn;
    }
}