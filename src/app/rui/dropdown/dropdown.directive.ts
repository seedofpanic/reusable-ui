import {
    Directive, Input, OnChanges, EventEmitter, Output, TemplateRef, ElementRef
} from '@angular/core';
import {RuiDropdownService} from './dropdown.service';
import {SubscriptionHandler} from '../tools/subscriptionHandler';
import {RuiFocusableDirective} from './focusable.dierctive';

@Directive({
    selector: '[ruiDropdown]',
    providers: [RuiDropdownService],
    host: {
        '(focus)': 'onFocus()',
        '(keydown.meta.z)': 'onUndo()',
        '(keydown.meta.shift.z)': 'onRedo()',
        '(mouseover)': 'this.service.setHover(true)',
        '(mouseout)': 'this.service.setHover(false)'
    }
})
export class RuiDropdownDirective extends SubscriptionHandler {
    @Input() itemTemplate: TemplateRef<any>;
    @Input('ruiDropdown') value;
    @Output('ruiDropdownChange') valueChange = new EventEmitter<string>();
    @Input('ruiSelected') selected;
    @Output('ruiSelected') selectedChange = new EventEmitter<any>();

    @Output() ruiChange = new EventEmitter();
    @Output() ruiSelect = new EventEmitter();
    @Output() ruiFocus = new EventEmitter();
    @Output() ruiBlur = new EventEmitter();

    skipValueChange: boolean;
    skipSelectedChange: boolean;

    constructor(public service: RuiDropdownService,
                private element: ElementRef) {
        super();

        this.service.root = this.element;

        this.subs = service.changeSubject
            .distinctUntilChanged((a, b) => a.value === b.value)
            .subscribe(value => {
                this.skipValueChange = true;
                this.ruiChange.emit(value.value);
                setTimeout(() => { // Can't change binding while in onChanges?
                    this.valueChange.emit(value.value);
                }, 0);
            });

        this.subs = service.selectSubject
            .distinctUntilChanged()
            .subscribe(event => {
                this.skipSelectedChange = true;
                this.ruiSelect.emit(event.value);
            });

        this.subs = service.selectSubject
            .subscribe((event) => {
                if (event.force || event.silent) {
                    return;
                }

                this.service.setFocus(true);
            });

        this.subs = service.focusSubject
            .distinctUntilChanged()
            .subscribe((focus) => {
                if (focus) {
                    this.ruiFocus.emit();
                } else {
                    this.service.openSubject.next(false);
                    this.ruiBlur.emit();
                }
            });
    }

    ngOnChanges(changes: OnChanges) {
        if (changes['value']) {
            if (this.skipValueChange) {
                this.skipValueChange = false;
                return;
            }

            this.service.changeSubject.next({value: this.value});
        }

        if (changes['itemTemplate']) {
            this.service.itemTemplate = this.itemTemplate;
        }

        if (changes['selected']) {
            if (this.skipSelectedChange || !this.selected) {
                this.skipSelectedChange = false;
                return;
            }

            this.service.selectSubject.next({silent: true, value: this.selected});
        }
    }

    onUndo() {
        this.service.undo();
    }

    onRedo() {
        this.service.redo();
    }

    ngOnDestroy() {
        this.freeSubs();
    }
}

