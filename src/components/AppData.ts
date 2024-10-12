import { IProductItem, ICart, TOrder, IUser, TPaymentMethod, IApi, TUserInfo, TOrderInfo, IOrder } from "../types";
import { IEvents } from "./base/events";
import { EMAIL_REGEXP, TEL_REGEXP } from "../utils/constants";
import { Api, ApiListResponse } from "./base/api";

export class AppData {
    products: IProductItem[] = [];
    preview: IProductItem | null = null;
    cart: ICart = {
        items: [],
        total: 0,
    };
    order: IUser = {
        email: '',
        phone: '',
        address: '',
        payment: '',
        // total: 0,
        // items: [],
    }
    formErrors: Partial<Record<keyof IUser, string>> = {};
    items: any;

    constructor(protected events: IEvents) {}

    setProducts(products: IProductItem[]) {
        this.products = products;
        this.events.emit('products:change', products);
    }

    setPreview(product: IProductItem) {
        this.preview = product;
        this.events.emit('preview:change', product);
    }

    isInCart(product: IProductItem) {
        return this.cart.items.some(item => item.id === product.id);
    }

    addToCart(product: IProductItem) {
        this.cart.items.push(product);
        this.cart.total += product.price;
        this.events.emit('cart:change');
    }

    removeFromCart(product: IProductItem) {
        this.cart.items = this.cart.items.filter(item => item.id !== product.id);
        this.cart.total -= product.price;
        this.events.emit('cart:change', product);
    }

    clearCart() {
        this.cart.items = [];
		this.cart.total = 0;
        this.events.emit('cart:change');
	}

    setPaymentMethod(method: TPaymentMethod) {
        this.order.payment = method;
    }

    setOrderField(field: keyof TOrderInfo, value: string) {
        if (field === 'payment') {
            this.setPaymentMethod(value as TPaymentMethod);
        } else {
            this.order.address = value;
        }
    }

    setUserField(field: string, value: string) {
            if (field === 'email') {
                this.order.email = value;
            } else if (field === 'phone') {
                this.order.phone = value;
            }
	}

    validateContactsForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!EMAIL_REGEXP.test(this.order.email)) {
			errors.email = 'Неправильно указан email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!TEL_REGEXP.test(this.order.phone)) {
			errors.phone = 'Неправильно указан телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

    validateOrderForm() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
    }

	clearOrder() {
		this.order = {
			email: '',
			phone: '',
			address: '',
			payment: '',
		};
        this.cart = {
            total: 0,
            items: []
        }
	}

    getOrder(): IOrder {
        return {
            payment: this.order.payment,
            address: this.order.address,
            email: this.order.email,
            phone: this.order.phone,
            total: this.cart.total,
            items: this.cart.items.map(item => item.id)
        }
    }

    clearAllAndClose() {
        this.clearOrder();
        this.events.emit('cart:close');
    }
}
