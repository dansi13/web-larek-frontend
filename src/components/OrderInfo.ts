import { Form } from "./common/Form";
import { IEvents } from "./base/events";
import { TOrderInfo, TPaymentMethod } from "../types";
import { ensureElement } from "../utils/utils";

export class OrderInfo extends Form<TOrderInfo> {
    protected _paymentCard: HTMLButtonElement;
    protected _paymentCash: HTMLButtonElement;
    protected _address: HTMLInputElement;
    protected isPaymentSelected = false;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._paymentCard = ensureElement('.button_alt[name=card]', this.container) as HTMLButtonElement;
        this._paymentCash = ensureElement('.button_alt[name=cash]', this.container) as HTMLButtonElement;
        this._address = ensureElement('.form__input[name=address]', this.container) as HTMLInputElement;
        this._submitButton = ensureElement('button[type=submit]', this.container) as HTMLButtonElement;

        this._paymentCard.addEventListener('click', () => {
            this.payment = 'card';
            this.onInputChange('payment', 'card');
        });
    
        this._paymentCash.addEventListener('click', () => {
            this.payment = 'cash';
            this.onInputChange('payment', 'cash');
        });

        this._address.addEventListener('input', () => {
            if (!this.isPaymentSelected) {
                this.onInputChange('payment', null)
            }
            this.onInputChange('address', this._address.value);
        });

        this._submitButton.addEventListener('click', () => {
            this.events.emit('user:submit');
        })
    }
    
    set payment(value: TPaymentMethod) {
		this.toggleClass(this._paymentCard, 'button_alt-active', value === 'card');
		this.toggleClass(this._paymentCash, 'button_alt-active', value === 'cash');
        this.isPaymentSelected = true;
    }
    
    set adress(value: string) {
        this._address.value = value;
    }

    ClearAllAndClose() {
        this.payment = null;
        this.adress = '';
    }
}


