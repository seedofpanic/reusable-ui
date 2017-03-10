import {Injectable, TemplateRef} from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';

@Injectable()
export class RuiDropdownService {
    watcher: Subject<any>;
    selectChanged: Subject<any>;
    openChanged: Subject<any>;
    itemTemplate: TemplateRef<any>;

    isOpen: boolean;

    openSubscription: Subscription;
    selectSubscription: Subscription;

    constructor() {
        this.watcher = new Subject();
        this.selectChanged = new Subject();
        this.openChanged = new Subject();

        this.openSubscription = this.openChanged
            .distinctUntilChanged()
            .subscribe(isOpen => {
                this.isOpen = isOpen;
            });

        this.selectSubscription = this.selectChanged
            .subscribe(() => {
                this.openChanged.next(false);
            })
    }

    toggleOpen() {
        this.openChanged.next(!this.isOpen);
    }

    ngOnDestroy() {
        this.openSubscription.unsubscribe();
        this.selectSubscription.unsubscribe();
    }
}