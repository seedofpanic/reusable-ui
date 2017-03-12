import {Directive, ElementRef, HostListener, OnDestroy} from '@angular/core';
import {RuiDropdownService} from './dropdown.service';
import {SubscriptionHandler} from '../tools/subscriptionHandler';
import {elementHasParent} from '../tools/domHelpers';

@Directive({
    selector: '[ruiFocusable]'
})
export class RuiFocusableDirective extends SubscriptionHandler implements OnDestroy {

    constructor(private service: RuiDropdownService,
                private element: ElementRef) {
        super();
        if (!this.service.lastFocusedRef) {
            this.service.lastFocusedRef = this.element;
        }
    }

    @HostListener('blur', ['$event'])
    onBlur(event: FocusEvent) {
        if (
            !(event.relatedTarget && elementHasParent(new ElementRef(event.relatedTarget), this.service.root))
            && !this.service.isHovered
        ) {
            this.service.setFocus(false);
        }
    }

    @HostListener('focus')
    onFocus() {
        this.service.lastFocusedRef = this.element;
        this.service.setFocus(true);
    }

    ngOnDestroy() {
        this.freeSubs();
    }

    preventDefault(e: KeyboardEvent) {
        e.preventDefault();
    }
}
