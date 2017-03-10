import {Directive, Input, ViewContainerRef, TemplateRef, OnChanges, EmbeddedViewRef} from '@angular/core';
import {Subscription, Observable} from 'rxjs';
import {RuiDropdownService} from './dropdown.service';

@Directive({
    selector: '[ruiItem]'
})
export class RuiItemDirective {

    @Input() ruiItem: any;
    context: {
        item: any,
        isSelected: boolean,
    };

    clickSubscription: Subscription;
    changeSubscription: Subscription;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        private service: RuiDropdownService
    ) {

        this.changeSubscription = this.service.selectChanged
            .distinctUntilChanged()
            .subscribe(selected => {
                this.context.isSelected = this.ruiItem === selected;
            })
    }

    ngOnChanges(changes: OnChanges) {
        if (changes['ruiItem']) {
            this.context = {
                item: this.ruiItem,
                isSelected: false
            };

            const view: EmbeddedViewRef<any> = this.viewContainerRef
                .createEmbeddedView(this.service.itemTemplate || this.templateRef, {context: this.context});

            if (this.clickSubscription) {
                this.clickSubscription.unsubscribe();
            }

            this.clickSubscription = Observable.fromEvent(view.rootNodes[0].nextSibling, 'click')
                .subscribe(() => {
                    this.service.selectChanged.next(this.ruiItem);
                    this.service.watcher.next(this.ruiItem);
                });
        }
    }

    ngOnDestroy() {
        if (this.clickSubscription) {
            this.clickSubscription.unsubscribe();
        }

        this.changeSubscription.unsubscribe();
    }
}