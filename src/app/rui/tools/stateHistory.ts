export class IState {
    name: string;
    data: any;
}

export class StateHistory {

    private history: IState[] = [];
    private pointer: number;

    constructor(private capacity: number = 50) {}

    do(name: string, data?: any) {
        if (this.pointer !== this.history.length - 1) {
            this.history = this.history.slice(0, this.pointer + 1);
        }

        if (this.history.length === this.capacity) {
            this.history.shift();
        }

        this.history.push({name, data});
        this.pointer = this.history.length - 1;
    }

    undo(): IState {
        if (this.pointer > -1) {
            return this.history[this.pointer--];
        }

        return;
    }

    redo(): IState {
        if (this.pointer < this.history.length - 1) {
            return this.history[++this.pointer];
        }

        return;
    }

    clear() {
        this.history.length = 0;
    }
}