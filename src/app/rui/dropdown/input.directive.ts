import {Directive, ElementRef, Renderer} from '@angular/core';
import {Observable} from 'rxjs';
import {RuiDropdownService} from './dropdown.service';
import {SubscriptionHandler} from '../tools/subscriptionHandler';
import {elementHasParent} from '../tools/domHelpers';

@Directive({
    selector: '[ruiInput]'
})
export class RuiInputDirective extends SubscriptionHandler {

    constructor(private service: RuiDropdownService,
                private element: ElementRef,
                private renderer: Renderer) {
        super();

        this.subs = this.service.setSubject
            .distinctUntilChanged()
            .subscribe((value) => {
                this.renderer.setElementProperty(this.element.nativeElement, 'value', value);
            });

        this.subs = Observable.fromEvent(element.nativeElement, 'input')
            .subscribe((event: any) => { // TODO: type?
                service.changeSubject.next(event.target.value);
            });

        this.subs = this.service.focusSubject
            .subscribe(() => {
                this.renderer.invokeElementMethod(this.element.nativeElement, 'focus');
            });

        this.subs = Observable.fromEvent(this.element.nativeElement, 'blur')
            .subscribe((event: FocusEvent) => {
                if (!event.relatedTarget || !elementHasParent(new ElementRef(event.relatedTarget), this.service.root)) {
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
}