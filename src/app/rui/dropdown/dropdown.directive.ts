import {
    Directive, Input, OnChanges, EventEmitter, Output, TemplateRef
} from '@angular/core';
import {RuiDropdownService} from './dropdown.service';
import {Subscription} from 'rxjs';

@Directive({
    selector: '[ruiDropdown]',
    providers: [RuiDropdownService]
})
export class RuiDropdownDirective {
    @Input() itemTemplate: TemplateRef<any>;
    @Input('ruiDropdown') value;
    @Output('ruiDropdownChange') valueChange = new EventEmitter<string>();

    changeSubscription: Subscription;

    constructor(public service: RuiDropdownService) {
        this.changeSubscription = service.watcher
            .distinctUntilChanged()
            .subscribe(value => {
                this.valueChange.emit(value);
            });
    }

    ngOnChanges(changes: OnChanges) {
        if (changes['ruiDropdown']) {
            this.service.watcher.next(this.value);
        }

        if (changes['itemTemplate']) {
            this.service.itemTemplate = this.itemTemplate;
        }
    }

    ngOnDestroy() {
        this.changeSubscription.unsubscribe();
    }
}

