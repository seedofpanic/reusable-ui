// TODO: Decide on this tslint rules
/* tslint:disable:no-output-rename no-input-rename*/

import {Directive, Input, Output, EventEmitter, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {RuiDropdownService} from './dropdown.service';
import {SubscriptionHandler} from '../tools/subscriptionHandler';

@Directive({
    selector: '[ruiMenu]'
})
export class RuiMenuDirective extends SubscriptionHandler implements OnDestroy, OnChanges {
    @Input('ruiMenu') isOpen;
    @Output('ruiMenuChange') isOpenChange = new EventEmitter();

    constructor(private service: RuiDropdownService) {
        super();

        this.subs = this.service.openSubject
            .distinctUntilChanged()
            .subscribe(isOpen => {
                this.isOpenChange.next(isOpen);
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isOpen']) {
            this.service.openSubject.next(this.isOpen);
        }
    }

    ngOnDestroy() {
        this.freeSubs();
    }
}
