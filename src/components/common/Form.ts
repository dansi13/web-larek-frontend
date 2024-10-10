import { View } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

interface IForm {
    valid: boolean;
    errors: string[];
    payment: string;
    adress: string;
    email: string;
    phone: string;
}

export class Form<T> extends View<IForm> {
    _submitButton: HTMLButtonElement;
    _errorMessage: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
        this._submitButton = ensureElement('button[type=submit]', this.container) as HTMLButtonElement;
        this._errorMessage = ensureElement('.form__errors', this.container) as HTMLElement;
        
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange( field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
    }

    set valid(valid: boolean) {
        this._submitButton.disabled = !valid;
    }
    
    set errors(errors: string) {
        this.setText(this._errorMessage, errors);
    }

    render(data?: Partial<IForm>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}