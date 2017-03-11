import {Directive, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {RuiDropdownService} from './dropdown.service';
import {Subscription} from 'rxjs';

@Directive({
    selector: '[ruiMenu]'
})
export class RuiMenuDirective {
    @Input('ruiMenu') isOpen;
    @Output('ruiMenuChange') isOpenChange = new EventEmitter();

    openSubscription: Subscription;

    constructor(private service: RuiDropdownService) {
        this.openSubscription = this.service.openSubject
            .distinctUntilChanged()
            .subscribe(isOpen => {
                this.isOpenChange.next(isOpen);
            });
    }

    ngOnChanges(changes: OnChanges) {
        if (changes['ruiMenu']) {
            this.service.openSubject.next(this.isOpen);
        }
    }

    ngOnDestroy() {
        this.openSubscription.unsubscribe();
    }
}