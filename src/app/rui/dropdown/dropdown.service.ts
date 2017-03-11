import {Injectable, TemplateRef, ElementRef} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {SubscriptionHandler} from '../tools/subscriptionHandler';
import {StateHistory, IState} from '../tools/stateHistory';

@Injectable()
export class RuiDropdownService extends SubscriptionHandler{
    changeSubject = new Subject<{silent?: boolean, force?: boolean, value: string}>();
    selectSubject: Subject<any> = new Subject();
    openSubject: Subject<any> = new Subject();
    focusSubject: Subject<any> = new Subject();
    blurSubject: Subject<any> = new Subject();

    root: ElementRef;
    itemTemplate: TemplateRef<any>;

    isOpen: boolean;
    isFocused: boolean;

    history: StateHistory;

    constructor() {
        super();

        this.history = new StateHistory();

        this.subs = this.openSubject
            .distinctUntilChanged()
            .subscribe(isOpen => {
                this.isOpen = isOpen;
            });

        this.subs = this.selectSubject
            .subscribe(() => {
                this.openSubject.next(false);
            });

        this.subs = this.changeSubject
            .distinctUntilChanged((a, b) => a.value === b.value)
            .audit(value => {
                if (value.force) {
                    return Observable.interval(0);
                } else {
                    return Observable.interval(500);
                }
            })
            .pairwise()
            .subscribe(value => {
                if (value[1].silent) {
                    return;
                }

                this.history.do('change', {o: value[0], n: value[1]});
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

    undo() {
        const state: IState = this.history.undo();
        if (!state) {
            return;
        }

        switch (state.name) {
            case 'change':
                this.changeSubject.next({silent: true, value: state.data.o.value});
                break;
        }
    }

    redo() {
        const state: IState = this.history.redo();
        if (!state) {
            return;
        }

        switch (state.name) {
            case 'change':
                this.changeSubject.next({silent: true, value: state.data.n.value});
                break;
        }
    }
}