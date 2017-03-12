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
            .subscribe(event => {
                this.renderer.setElementProperty(this.element.nativeElement, 'value', event.value);
            });

        this.subs = Observable.fromEvent(element.nativeElement, 'input')
            .subscribe((event: any) => { // TODO: type?
                service.changeSubject.next({value: event.target.value});
            });
    }

    ngOnDestroy() {
        this.freeSubs();
    }

    preventDefault(e: KeyboardEvent) {
        e.preventDefault();
    }
}