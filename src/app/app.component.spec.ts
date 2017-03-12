/* tslint:disable:no-unused-variable */

import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {DropdownModule} from './demo-ui/dropdown/dropdown.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [
              FormsModule,
              ReactiveFormsModule,
              DropdownModule
            ]
        });
        TestBed.compileComponents();
    });

    it('should create the app', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
