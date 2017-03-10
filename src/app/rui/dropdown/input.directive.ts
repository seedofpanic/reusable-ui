import {Directive, ElementRef} from '@angular/core';
import {Subscription, Observable} from 'rxjs';
import {RuiDropdownService} from './dropdown.service';

@Directive({
    selector: '[ruiInput]'
})
export class RuiInputDirective {

    inputSubscription: Subscription;

    constructor(private service: RuiDropdownService,
                private input: ElementRef) {
        this.inputSubscription = Observable.fromEvent(input.nativeElement, 'input')
            .subscribe((event: any) => { // TODO: type?
                service.watcher.next(event.target.value);
            });
    }

    ngOnDestroy() {
        this.inputSubscription.unsubscribe();
    }
}