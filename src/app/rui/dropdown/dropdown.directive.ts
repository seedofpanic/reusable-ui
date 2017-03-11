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
        '(keydown.meta.shift.z)': 'onRedo()',
        '(mouseover)': 'this.service.setHover(true)',
        '(mouseout)': 'this.service.setHover(false)'
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
            .distinctUntilChanged()
            .subscribe(event => {
                this.ruiSelect.emit(event.value);
            });

        this.subs = service.selectSubject
            .subscribe((event) => {
                if (event.force) {
                    return;
                }

                this.service.setFocus(true);
            });

        this.subs = service.focusSubject
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
            this.service.selectSubject.next({force: true, value: this.value});
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

