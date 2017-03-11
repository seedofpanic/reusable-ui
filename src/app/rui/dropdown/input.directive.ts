import {Directive, ElementRef, Renderer} from '@angular/core';
import {Observable} from 'rxjs';
import {RuiDropdownService} from './dropdown.service';
import {SubscriptionHandler} from '../tools/subscriptionHandler';
import {elementHasParent} from '../tools/domHelpers';

@Directive({
    selector: '[ruiInput]',
    host: {
        '(keydown.meta.z)': 'preventDefault($event)',
        '(keydown.meta.shift.z)': 'preventDefault($event)'
    }
})
export class RuiInputDirective extends SubscriptionHandler {

    constructor(private service: RuiDropdownService,
                private element: ElementRef,
                private renderer: Renderer) {
        super();

        this.subs = this.service.changeSubject
            .distinctUntilChanged()
            .subscribe(value => {
                this.renderer.setElementProperty(this.element.nativeElement, 'value', value.value);
            });

        this.subs = Observable.fromEvent(element.nativeElement, 'input')
            .subscribe((event: any) => { // TODO: type?
                service.changeSubject.next({value: event.target.value});
            });

        this.subs = this.service.focusSubject
            .subscribe(event => {
                if (event) {
                    this.renderer.invokeElementMethod(this.element.nativeElement, 'focus');
                }
            });

        this.subs = Observable.fromEvent(this.element.nativeElement, 'blur')
            .subscribe((event: FocusEvent) => {
                if (!this.service.isHovered) {
                    this.service.setFocus(false);
                }
            });

        this.subs = Observable.fromEvent(this.element.nativeElement, 'focus')
            .subscribe((event: FocusEvent) => {
                this.service.setFocus(true);
            });
    }

    ngOnDestroy() {
        this.freeSubs();
    }

    preventDefault(e: KeyboardEvent) {
        e.preventDefault();
    }
}