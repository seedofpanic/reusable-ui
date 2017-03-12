import {
    Directive, Input, OnChanges, SimpleChanges, EventEmitter, Output, TemplateRef, ElementRef, OnDestroy, HostListener
} from '@angular/core';
import {RuiDropdownService} from './dropdown.service';
import {SubscriptionHandler} from '../tools/subscriptionHandler';

@Directive({
    selector: '[ruiDropdown]',
    providers: [RuiDropdownService]
})
export class RuiDropdownDirective extends SubscriptionHandler implements OnChanges, OnDestroy {
    @Input() itemTemplate: TemplateRef<any>;
    @Input('ruiDropdown') value: string;
    @Output('ruiDropdownChange') valueChange = new EventEmitter<string>();
    @Input('ruiSelected') selected: any;
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

    ngOnChanges(changes: SimpleChanges) {
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

    @HostListener('mouseover')
    onMouseover() {
        this.service.setHover(true);
    }

    @HostListener('mouseout')
    onMouseout() {
        this.service.setHover(false);
    }

    @HostListener('keydown.meta.z')
    onUndo() {
        this.service.undo();
    }

    @HostListener('keydown.meta.shift.z')
    onRedo() {
        this.service.redo();
    }

    ngOnDestroy() {
        this.freeSubs();
    }
}

