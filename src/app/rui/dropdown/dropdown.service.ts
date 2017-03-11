import {Injectable, TemplateRef} from '@angular/core';
import {Subject, Subscription} from 'rxjs';

@Injectable()
export class RuiDropdownService {
    changeSubject: Subject<any>;
    selectSubject: Subject<any>;
    openSubject: Subject<any>;
    itemTemplate: TemplateRef<any>;

    isOpen: boolean;

    openSubscription: Subscription;
    selectSubscription: Subscription;

    constructor() {
        this.changeSubject = new Subject();
        this.selectSubject = new Subject();
        this.openSubject = new Subject();

        this.openSubscription = this.openSubject
            .distinctUntilChanged()
            .subscribe(isOpen => {
                this.isOpen = isOpen;
            });

        this.selectSubscription = this.selectSubject
            .subscribe(() => {
                this.openSubject.next(false);
            })
    }

    toggleOpen() {
        this.openSubject.next(!this.isOpen);
    }

    ngOnDestroy() {
        this.openSubscription.unsubscribe();
        this.selectSubscription.unsubscribe();
    }
}