import { View } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement, cloneTemplate, createElement } from "../utils/utils";

interface ICartView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class Cart extends View<ICartView> {
    static template = ensureElement('#basket') as HTMLTemplateElement;

    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(events: IEvents) {
        super(cloneTemplate(Cart.template), events);
        this._list = ensureElement('.basket__list', this.container) as HTMLElement;
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        this._button.addEventListener('click', () => {
            this.events.emit('cart:submit');
        });
        this.items = [];
    }

    toggleButton(state: boolean) {
        this.setDisabled(this._button, !state);
    }
    
    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
    
    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this.toggleButton(true);
        } else {
            this._list.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: 'Корзина пуста',
                })
            );
            this.toggleButton(false);
        }
    }
}