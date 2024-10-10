import { IEvents } from "./base/events";
import { TUserInfo } from "../types";
import { Form } from "../components/common/Form";
import { ensureElement } from "../utils/utils";

export class UserInfo extends Form<TUserInfo> {
    protected _phone: HTMLInputElement;
    protected _email: HTMLInputElement;
	static errors: string;
	static valid: boolean;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._phone = ensureElement<HTMLInputElement>('.form__input[name=phone]', this.container);
        this._email = ensureElement<HTMLInputElement>('.form__input[name=email]', this.container);
        this._submitButton = ensureElement('button[type=submit]', this.container) as HTMLButtonElement;

        this._phone.addEventListener('input', () => {
            this.onInputChange('phone', this._phone.value);
        });

        this._email.addEventListener('input', () => {
            this.onInputChange('email', this._email.value);
        });

        this._submitButton.addEventListener('click', () => {
            this.events.emit('contact:submit');
        })
    }

    set email(email: string) {
        this._email.value = email;
    }

    set phone(phone: string) {
        this._phone.value = phone;
    }

    ClearAllAndClose() {
        this.phone = null;
        this.email = null;
    }
}



