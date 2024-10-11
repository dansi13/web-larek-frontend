import { IProductItem, ICart, TOrder, IUser, TPaymentMethod, IApi, TUserInfo } from "../types";
import { IEvents } from "./base/events";
import { EMAIL_REGEXP, TEL_REGEXP } from "../utils/constants";
import { Api, ApiListResponse } from "./base/api";

export class AppData {
    products: IProductItem[] = [];
    preview: IProductItem | null = null;
    cart: ICart = {
        items: [],
        total: 0,
        find: function (arg0: (item: { id: IProductItem; }) => boolean): unknown {
            throw new Error("Function not implemented.");
        }
    };
    user: IUser = {
        email: '',
        phone: '',
        address: '',
        payment: ''
    }
    formErrors: Partial<Record<keyof IUser, string>> = {};
    items: any;
    order: any;

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
        this.user.payment = method;
        this.events.emit('user:change');
    }

    setOrderField(field: keyof TPaymentMethod, value: string) {
        if (field as string === 'payment') {
            this.setPaymentMethod(value as TPaymentMethod);
        } else {
            this.user[field as keyof IUser] = value as TPaymentMethod;
        }
    }

    setUserField(field: string, value: string) {
            if (field === 'email') {
                this.user.email = value;
            } else if (field === 'phone') {
                this.user.phone = value;
            }
	}

    validateContactsForm() {
		const errors: typeof this.formErrors = {};
		if (!this.user.email) {
			errors.email = 'Необходимо указать email';
		} else if (!EMAIL_REGEXP.test(this.user.email)) {
			errors.email = 'Неправильно указан email';
		}
		if (!this.user.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!TEL_REGEXP.test(this.user.phone)) {
			errors.phone = 'Неправильно указан телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

    validateOrderForm() {
        const errors: typeof this.formErrors = {};
        if (!this.user.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.user.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
    }

	clearOrder() {
		this.user = {
			email: '',
			phone: '',
			address: '',
			payment: '',
		};
	}

    getOrder() {
        return {
            payment: this.user.payment,
            address: this.user.address,
            email: this.user.email,
            phone: this.user.phone,
            total: this.cart.total,
            items: this.cart.items.map(item => item.id)
        }
    }

    clearAllAndClose() {
        this.clearOrder();
        this.events.emit('cart:close');
    }
}
