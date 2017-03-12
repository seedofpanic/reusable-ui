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
    }

    ngOnDestroy() {
        this.freeSubs();
    }
}