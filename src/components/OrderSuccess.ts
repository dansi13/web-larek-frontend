import { View } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

interface ISuccess {
    total: number
}

interface ISuccessActions {
    onClick: (event: MouseEvent) => void
}

export class OrderSuccess extends View<ISuccess> {
    protected _close: HTMLButtonElement;
    protected _total: HTMLElement;
    constructor(container: HTMLElement, events: IEvents, actions: ISuccessActions) {
        super(container, events);
        this._close = ensureElement('.order-success__close', this.container) as HTMLButtonElement;
        this._total = ensureElement('.order-success__description', this.container) as HTMLElement;

        if (actions) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
    set total(total: number) {
        this.setText(this._total, `Списано ${total} синапсов`);
    }
}