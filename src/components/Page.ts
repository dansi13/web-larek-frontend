import { View } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

interface IPage {
    products: HTMLElement[];
    counter: number;
    locked: boolean;
}

export class Page extends View<IPage> {
    protected _products: HTMLElement;
    protected _counter: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _cart: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this._products = ensureElement<HTMLElement>('.gallery');;
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._cart = ensureElement<HTMLElement>('.header__basket');

        this._cart.addEventListener('click', () => {
            this.events.emit('cart:open');
        });
    }

    set counter(counter: number) {
        this._counter.innerHTML = String(counter);
    }

    set locked(locked: boolean) {
        this.toggleClass(this._wrapper, 'page__wrapper_locked', locked);
    }

    set products(products: HTMLElement[]) {
        this._products.innerHTML = '';
        products.forEach(product => {
            this._products.append(product);
        });
    }

    set catalog(catalog: HTMLElement[]) {
        this._products.replaceChildren(...catalog);
    }
}