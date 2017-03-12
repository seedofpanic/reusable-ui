import {Injectable, TemplateRef, ElementRef, Renderer, OnDestroy} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {SubscriptionHandler} from '../tools/subscriptionHandler';
import {StateHistory, IState} from '../tools/stateHistory';

interface DropdownEvent<T> {
    silent?: boolean;
    force?: boolean;
    value?: T;
}

@Injectable()
export class RuiDropdownService extends SubscriptionHandler implements OnDestroy {
    changeSubject = new Subject<DropdownEvent<string>>();
    selectSubject = new Subject<DropdownEvent<any>>();
    openSubject = new Subject<any>();
    focusSubject = new Subject<any>();

    lastFocusedRef: ElementRef;
    root: ElementRef;
    itemTemplate: TemplateRef<any>;

    isOpen: boolean;
    isFocused: boolean;
    isHovered: boolean;

    history: StateHistory;

    constructor(private renderer: Renderer) {
        super();

        this.history = new StateHistory();

        this.subs = this.openSubject
            .distinctUntilChanged()
            .subscribe(isOpen => {
                this.isOpen = isOpen;
            });

        this.subs = this.selectSubject
            .pairwise()
            .subscribe((event) => {
                if (!event[1].force) {
                    this.history.do('select', event);
                }

                this.openSubject.next(false);

                if (!event[1].value || event[0].value === event[1].value) {
                    return;
                }

                this.changeSubject.next({
                    value: event[1].value.toString(),
                    silent: true,
                    force: event[1].force
                });
            });

        this.selectSubject.next({});

        // TODO: refactor
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
            .subscribe(event => {
                if (event[1].silent) {
                    return;
                }

                this.history.do('change', event);
            });

        this.subs = this.focusSubject
            .subscribe(event => {
                if (event) {
                    if (!this.lastFocusedRef) {
                        this.focusSubject.next(false);
                        return;
                    }

                    this.renderer.invokeElementMethod(this.lastFocusedRef.nativeElement, 'focus');
                }
            });
    }

    toggleOpen() {
        this.openSubject.next(!this.isOpen);
    }

    ngOnDestroy() {
        this.freeSubs();
    }

    setFocus(focus: boolean) {
        this.focusSubject.next(focus);
    }

    setHover(hover: boolean) {
        this.isHovered = hover;
    }

    undo() {
        const state: IState = this.history.undo();
        if (!state) {
            return;
        }

        switch (state.name) {
            case 'change':
                this.changeSubject.next({silent: true, value: state.data[0].value});
                break;
            case 'select':
                this.changeSubject.next({silent: true, value: state.data[0].value});
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
                this.changeSubject.next({silent: true, value: state.data[1].value});
                break;
            case 'select':
                this.changeSubject.next({silent: true, value: state.data[1].value});
                break;
        }
    }
}
