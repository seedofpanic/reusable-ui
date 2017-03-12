import {
  Directive,
  Input,
  ViewContainerRef,
  TemplateRef,
  OnChanges,
  SimpleChanges,
  EmbeddedViewRef,
  OnDestroy
} from '@angular/core';
import {Subscription, Observable} from 'rxjs';
import {RuiDropdownService} from './dropdown.service';
import {SubscriptionHandler} from '../tools/subscriptionHandler';

@Directive({
    selector: '[ruiItem]'
})
export class RuiItemDirective extends SubscriptionHandler implements OnDestroy, OnChanges {

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
                this.context.isSelected = this.ruiItem === selected.value;
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['ruiItem']) {
            this.context = {
                item: this.ruiItem,
                isSelected: false
            };

            const view = this.viewContainerRef
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
