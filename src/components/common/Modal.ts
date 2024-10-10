import { View } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

interface IModal {
    content: HTMLElement;
}

export class Modal extends View<IModal> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._closeButton = ensureElement('.modal__close', this.container) as HTMLButtonElement;
        this._content = ensureElement('.modal__content', this.container) as HTMLElement;
        this._closeButton.addEventListener('click', (this.close.bind(this)));


        this.container.addEventListener('click', (e: Event) => {
            if ((e.target as HTMLElement).classList.contains('modal')) {
                this.close();
            }
        });

        this._content.addEventListener('click', (e: Event) => {
            e.stopPropagation();
        });
    }
    set content(content: HTMLElement) {
        this._content.innerHTML = '';
        this._content.append(content);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    render(data?: Partial<IModal>): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}