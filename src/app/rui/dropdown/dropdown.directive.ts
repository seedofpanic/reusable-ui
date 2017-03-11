import {
    Directive, Input, OnChanges, EventEmitter, Output, TemplateRef, ElementRef
} from '@angular/core';
import {RuiDropdownService} from './dropdown.service';
import {SubscriptionHandler} from '../tools/subscriptionHandler';

@Directive({
    selector: '[ruiDropdown]',
    providers: [RuiDropdownService],
    host: {
        '(focus)': 'onFocus()',
        '(keydown.meta.z)': 'onUndo()',
        '(keydown.meta.shift.z)': 'onRedo()'
    }
})
export class RuiDropdownDirective extends SubscriptionHandler {
    @Input() itemTemplate: TemplateRef<any>;
    @Input('ruiDropdown') value;
    @Output('ruiDropdownChange') valueChange = new EventEmitter<string>();

    @Output() ruiChange = new EventEmitter();
    @Output() ruiSelect = new EventEmitter();
    @Output() ruiFocus = new EventEmitter();
    @Output() ruiBlur = new EventEmitter();

    constructor(public service: RuiDropdownService,
                private element: ElementRef) {
        super();

        this.service.root = this.element;

        this.subs = service.changeSubject
            .distinctUntilChanged((a, b) => a.value === b.value)
            .subscribe(value => {
                this.ruiChange.emit(value.value);
                this.valueChange.emit(value.value);
            });

        this.subs = service.selectSubject
            .subscribe(selected => {
                this.ruiSelect.emit(selected);
            });

        this.subs = service.blurSubject
            .subscribe(() => {
                this.service.openSubject.next(false);
                this.ruiBlur.emit();
            });

        this.subs = service.selectSubject
            .subscribe(() => {
                this.service.setFocus(false);
            });

        this.subs = service.focusSubject
            .distinctUntilChanged((a, b) => a && (a != b))
            .subscribe((focus) => {
                this.ruiFocus.emit();
            });
    }

    ngOnChanges(changes: OnChanges) {
        if (changes['value']) {
            this.service.changeSubject.next({force: true, value: this.value});
        }

        if (changes['itemTemplate']) {
            this.service.itemTemplate = this.itemTemplate;
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

