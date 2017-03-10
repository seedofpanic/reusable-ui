import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

class CustomItem {

    constructor(public text: string) {
    }

    toString(): string {
        return this.text;
    }
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    form: FormGroup;
    customItems: CustomItem[];

    constructor(formBulder: FormBuilder) {

        this.customItems = [
            new CustomItem('0'),
            new CustomItem('1'),
            new CustomItem('2'),
            new CustomItem('3'),
        ];

        this.form = formBulder.group({
            ddTest: ['test'],
            ddTest2: ['test2']
        });
    }
}
