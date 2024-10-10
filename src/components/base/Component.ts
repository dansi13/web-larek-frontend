import { IEvents } from "./events";

export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
    }

    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    protected setText(element: HTMLElement, value: string) {
		if (element) {
			element.textContent = value;
		}
	}

    setDisabled(element: HTMLElement, state: boolean): void {
        if (state) element.setAttribute('disabled', 'disabled');
        else element.removeAttribute('disabled');
    }
    

    protected setHidden(element: HTMLElement): void {
        element.style.display = 'none';
    }
    

    protected setVisible(element: HTMLElement): void {
        element.style.removeProperty('display');
    }
    
    protected setImage(el: HTMLImageElement, src: string, alt?: string): void {
        el.src = src;
        if (alt) {
            el.alt = alt;
        }
    }

    protected setSerialNumber(element: HTMLElement, number: number): void {
        element.textContent = String(number);
    }
    
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}

export class View<T> extends Component<T> {
	constructor(container: HTMLElement, protected readonly events: IEvents) {
		super(container);
	}
}