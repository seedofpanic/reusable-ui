import {Subscription} from 'rxjs';

export class SubscriptionHandler {

    private _subs: Subscription[] = [];

    set subs(sub: Subscription) {
        this._subs.push(sub);
    }

    protected freeSubs() {
        this._subs.forEach(sub => {
            sub.unsubscribe();
        });
    }
}