import {Directive, ElementRef} from '@angular/core';
import {RuiDropdownService} from './dropdown.service';
import {Observable, Subscription} from 'rxjs';

@Directive({
    selector: '[ruiToggle]'
})
export class RuiToggleDirective {

    clickSubscription: Subscription;

    constructor(private service: RuiDropdownService,
                private element: ElementRef) {
        this.clickSubscription = Observable.fromEvent(element.nativeElement, 'click')
            .subscribe(() => {
                this.service.toggleOpen();
            })
    }

    ngOnDestroy() {
        this.clickSubscription.unsubscribe();
    }
}