import {
    Directive, Input, OnChanges, EventEmitter, Output, TemplateRef, Renderer, ElementRef
} from '@angular/core';
import {RuiDropdownService} from './dropdown.service';
import {Subscription} from 'rxjs';
import {SubscriptionHandler} from '../tools/subscriptionHandler';

@Directive({
    selector: '[ruiDropdown]',
    providers: [RuiDropdownService],
    host: {
        '(focus)': 'onFocus()'
    }
})
export class RuiDropdownDirective extends SubscriptionHandler {
    @Input() itemTemplate: TemplateRef<any>;
    @Input('ruiDropdown') value;
    @Output('ruiDropdownChange') valueChange = new EventEmitter<string>();

    @Output() ruiInput = new EventEmitter();
    @Output() ruiChange = new EventEmitter();
    @Output() ruiSelect = new EventEmitter();
    @Output() ruiFocus = new EventEmitter();
    @Output() ruiBlur = new EventEmitter();
    @Output() ruiKeydown = new EventEmitter();
    @Output() ruiKeyup = new EventEmitter();
    @Output() ruiKeypress = new EventEmitter();

    constructor(public service: RuiDropdownService,
                private element: ElementRef,
                private renderer: Renderer) {
        super();

        this.service.root = this.element;

        this.subs = service.changeSubject
            .distinctUntilChanged()
            .subscribe(value => {
                this.valueChange.emit(value);
            });

        this.subs = service.blurSubject
            .distinctUntilChanged((a, b) => a && (a != b))
            .subscribe(() => {
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
            this.service.setSubject.next(this.value);
        }

        if (changes['itemTemplate']) {
            this.service.itemTemplate = this.itemTemplate;
        }
    }

    ngOnDestroy() {
        this.freeSubs();
    }
}

