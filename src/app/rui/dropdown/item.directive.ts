import {Directive, Input, ViewContainerRef, TemplateRef, OnChanges, EmbeddedViewRef} from '@angular/core';
import {Subscription, Observable} from 'rxjs';
import {RuiDropdownService} from './dropdown.service';
import {SubscriptionHandler} from '../tools/subscriptionHandler';

@Directive({
    selector: '[ruiItem]'
})
export class RuiItemDirective extends SubscriptionHandler {

    @Input() ruiItem: any;
    context: {
        item: any,
        isSelected: boolean,
    };

    clickSubscription: Subscription;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        private service: RuiDropdownService
    ) {
        super();

        this.subs = this.service.selectSubject
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
                    this.service.selectSubject.next({value: this.ruiItem});
                });
        }
    }

    ngOnDestroy() {
        if (this.clickSubscription) {
            this.clickSubscription.unsubscribe();
        }

        this.freeSubs();
    }
}