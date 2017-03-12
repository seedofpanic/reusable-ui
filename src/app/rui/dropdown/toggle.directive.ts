import {Directive, ElementRef, OnDestroy} from '@angular/core';
import {RuiDropdownService} from './dropdown.service';
import {Observable} from 'rxjs';
import {SubscriptionHandler} from '../tools/subscriptionHandler';

@Directive({
    selector: '[ruiToggle]'
})
export class RuiToggleDirective extends SubscriptionHandler implements OnDestroy {

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
