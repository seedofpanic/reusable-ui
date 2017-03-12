import {Directive, ElementRef} from '@angular/core';
import {RuiDropdownService} from './dropdown.service';
import {Observable} from 'rxjs';
import {SubscriptionHandler} from '../tools/subscriptionHandler';
import {elementHasParent} from '../tools/domHelpers';

@Directive({
    selector: '[ruiToggle]'
})
export class RuiToggleDirective extends SubscriptionHandler {

    constructor(private service: RuiDropdownService,
                private element: ElementRef) {
        super();

        this.subs = Observable.fromEvent(element.nativeElement, 'click')
            .subscribe(() => {
                this.service.toggleOpen();
            });

        this.subs = Observable.fromEvent(this.element.nativeElement, 'blur')
            .subscribe((event: FocusEvent) => {
                if (
                    !(event.relatedTarget && elementHasParent(new ElementRef(event.relatedTarget), this.service.root))
                    && !this.service.isHovered
                ) {
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