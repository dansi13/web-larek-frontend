import { IProductItem } from "../types";
import { IEvents } from "../components/base/events";
import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { categories } from "../utils/constants";

export interface IActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    render(data: Partial<IProductItem>): HTMLElement;
}

export class Card extends Component<IProductItem> {
    protected _element: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _title: HTMLElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _serialNumber?: HTMLElement;

    constructor(container: HTMLElement, actions?: IActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = container.querySelector('.card__image');
		this._price = ensureElement<HTMLImageElement>('.card__price', container);
		this._category = container.querySelector('.card__category');
		this._button = container.querySelector('.card__button');
		this._description = container.querySelector('.card__description');
        this._serialNumber = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

    set category (category: string) {
        this.setText(this._category, category);
        if (this._category) {
            this._category.classList.add(
				`card__category_${
                    categories.get(category) || 'other'
                }`
            );
        }
    }

    get category(): string {
        return this._category.textContent || '';
    }

    set price (price: string) {
        this.setText(this._price, price ? `${price} синапсов` : 'Бесценно');
		if (this._button) {
			this._button.disabled = !price;
		}
    }

    get price(): string {
        return this._price.textContent || '';
    }

    set image (image: string) {
        if (this._image) {
            this.setImage(this._image, image, this.title);
        }
    }

    set title (title: string) {
        this._title.innerHTML = title;
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set description (description: string) {
        this.setText(this._description, description);
    }

    set button(button: string) {
        this.setText(this._button, button);
    }

    set id(id: string) {
        this.container.dataset.id = id;
    }

    set serialNumber(number: number) {
        this.setSerialNumber(this._serialNumber, number)
    }

    get id(): string {
        return this.container.dataset.id || '';
    }
}