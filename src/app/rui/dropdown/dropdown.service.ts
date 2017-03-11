import {Injectable, TemplateRef, ElementRef} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {SubscriptionHandler} from '../tools/subscriptionHandler';

@Injectable()
export class RuiDropdownService extends SubscriptionHandler{
    setSubject: Subject<any> = new Subject();
    changeSubject: Subject<any> = new Subject();
    selectSubject: Subject<any> = new Subject();
    openSubject: Subject<any> = new Subject();
    focusSubject: Subject<any> = new Subject();
    blurSubject: Subject<any> = new Subject();

    root: ElementRef;
    itemTemplate: TemplateRef<any>;

    isOpen: boolean;
    isFocused: boolean;

    constructor() {
        super();

        this.subs = this.openSubject
            .distinctUntilChanged()
            .subscribe(isOpen => {
                this.isOpen = isOpen;
            });

        this.subs = this.selectSubject
            .subscribe(() => {
                this.openSubject.next(false);
            });
    }

    toggleOpen() {
        this.openSubject.next(!this.isOpen);
    }

    ngOnDestroy() {
        this.freeSubs();
    }

    setFocus(focus: boolean) {
        if (this.isFocused === focus) {
            return;
        }

        this.isFocused = focus;

        if (focus) {
            this.focusSubject.next();
        } else {
            this.blurSubject.next();
        }
    }
}