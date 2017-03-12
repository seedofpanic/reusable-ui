import {Directive, ElementRef, Renderer} from '@angular/core';
import {Observable} from 'rxjs';
import {RuiDropdownService} from './dropdown.service';
import {SubscriptionHandler} from '../tools/subscriptionHandler';
import {elementHasParent} from '../tools/domHelpers';

@Directive({
    selector: '[ruiFocusable]',
    host: {
        '(blur)': 'onBlur($event)',
        '(focus)': 'onFocus()'
    }
})
export class RuiFocusableDirective extends SubscriptionHandler {

    constructor(private service: RuiDropdownService,
                private element: ElementRef) {
        super();
        if (!this.service.lastFocusedRef) {
            this.service.lastFocusedRef = this.element;
        }
    }

    onBlur(event: FocusEvent) {
        if (
            !(event.relatedTarget && elementHasParent(new ElementRef(event.relatedTarget), this.service.root))
            && !this.service.isHovered
        ) {
            this.service.setFocus(false);
        }
    }

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