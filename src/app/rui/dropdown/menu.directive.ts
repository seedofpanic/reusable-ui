import {Directive, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {RuiDropdownService} from './dropdown.service';
import {SubscriptionHandler} from '../tools/subscriptionHandler';

@Directive({
    selector: '[ruiMenu]'
})
export class RuiMenuDirective extends SubscriptionHandler {
    @Input('ruiMenu') isOpen;
    @Output('ruiMenuChange') isOpenChange = new EventEmitter();

    constructor(private service: RuiDropdownService) {
        super();

        this.subs = this.service.openSubject
            .subscribe(isOpen => {
                this.isOpenChange.next(isOpen);
            });
    }

    ngOnChanges(changes: OnChanges) {
        if (changes['isOpen']) {
            this.service.openSubject.next(this.isOpen);
        }
    }

    ngOnDestroy() {
        this.freeSubs();
    }
}