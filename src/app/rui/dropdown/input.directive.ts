// TODO: Decide on this tslint rule
/* tslint:disable:use-host-property-decorator */

import {Directive, ElementRef, Renderer, OnDestroy, HostListener} from '@angular/core';
import {Observable} from 'rxjs';
import {RuiDropdownService} from './dropdown.service';
import {SubscriptionHandler} from '../tools/subscriptionHandler';
import {elementHasParent} from '../tools/domHelpers';

@Directive({
    selector: '[ruiInput]'
})
export class RuiInputDirective extends SubscriptionHandler implements OnDestroy {

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

    @HostListener('keydown.meta.z', ['$event'])
    @HostListener('keydown.meta.shift.z', ['$event'])
    preventDefault(e: KeyboardEvent) {
        e.preventDefault();
    }
}
