import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { AppData } from './components/AppData';
import { Card } from './components/Card';
import { OrderInfo } from './components/OrderInfo';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Cart } from './components/Cart';
import { Modal } from './components/common/Modal';
import { OrderSuccess } from './components/OrderSuccess';
import { IProductItem, ICart, IApi, TOrder, IUser, TPaymentMethod, TUserInfo } from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { UserInfo } from './components/UserInfo';
import { Api } from './components/base/api';

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(CDN_URL, API_URL, settings);

const appData = new AppData(events);

// const userData = new UserData(events);
// const basketData = new BasketData(events);
// const productItemData = new ProductItemData(events);

const cardCatalogTemplate: HTMLTemplateElement = document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview');
const cardBasketTemplate: HTMLTemplateElement = document.querySelector('#card-basket');
const modalCardTemplate: HTMLTemplateElement = document.querySelector('#modal-container');
const orderInfoTemplate: HTMLTemplateElement = document.querySelector('#order');
const contactsTemplate: HTMLTemplateElement = document.querySelector('#contacts');
const successTemplate: HTMLTemplateElement = document.querySelector('#success');

const modal = new Modal(modalCardTemplate, events);
const page = new Page(document.body, events);
const card = new Card(cloneTemplate(cardPreviewTemplate), {
    onClick: () => modal.open(),
})
const cart = new Cart(events);
const orderInfo = new OrderInfo(cloneTemplate(orderInfoTemplate), events);
const userInfo = new UserInfo(cloneTemplate(contactsTemplate), events);
const orderSuccess = new OrderSuccess(cloneTemplate(successTemplate), events, {
	onClick: () => modal.close(),
});

api.getProducts().then(appData.setProducts.bind(appData)).catch(console.error);

events.on('modal:open', () => {page.locked = true;});

events.on('modal:close', () => {page.locked = false;
	appData.clearOrder();
	orderInfo.ClearAllAndClose();
	userInfo.ClearAllAndClose();});

events.on(`card:select`, (product: IProductItem) => {
    appData.setPreview(product);
});

events.on(`products:change`, (items: IProductItem[]) => {
	page.catalog = items.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render(item);
	});
});

events.on('preview:change', (item: IProductItem) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (appData.isInCart(item)) {
				appData.removeFromCart(item);
				card.button = 'В корзину';
			} else {
				appData.addToCart(item);
				card.button = 'Удалить из корзины';
			}
		},
	});
    card.button = appData.isInCart(item) ? 'Удалить из корзины' : 'В корзину';
	modal.render({ content: card.render(item) });
});

events.on('cart:change', () => {
	page.counter = appData.cart.items.length;
	let items: HTMLElement[] = [];
	for (let i = 0; i < appData.cart.items.length; i++) {
		const item = appData.cart.items[i];
			
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => appData.removeFromCart(item),
		});
		card.serialNumber = i + 1;
		cart.total = appData.cart.total;
		items.push(card.render(item));
	};
	cart.items = items;
});


events.on('cart:open', () => {
	modal.render({ content: cart.render() });
})

events.on('cart:submit', () => {
	if (appData.user.address !== '' ) {
		modal.render({ content: userInfo.render() });
	} else if (appData.cart.items.length) {
		modal.render({ content: orderInfo.render() });
	} else {
		modal.render({ content: orderSuccess.render() });
	}
});

events.on('user:open', () => {
	appData.clearOrder();
	modal.render({
		content: orderInfo.render({
			payment: 'card',
			adress: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('user:submit', () => {
	appData.clearOrder();
	modal.render({
		content: userInfo.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	/^order\..*:change$/,
	(data: { field: keyof TPaymentMethod; value: string }) => {
		appData.setOrderField(data.field, data.value);
		appData.validateOrderForm();
	}
);

events.on(
	/^contacts\..*:change$/,
	(data: { field: keyof TUserInfo; value: string }) => {
		// appData.setOrderField(data.field, data.value);
		appData.setUserField(data.field, data.value);
		appData.validateContactsForm();
	}
);

events.on('orderFormErrors:change', (error: Partial<IUser>) => {
	const { payment, address } = error;
	const formIsValid = !payment && !address;
	orderInfo.valid = formIsValid;
	if (!formIsValid) {
		orderInfo.errors = address ? address : payment;
	} else {
		orderInfo.errors = '';
	}
});

events.on('contactsFormErrors:change', (error: Partial<IUser>) => {
	const { email, phone } = error;
	userInfo.valid = !email && !phone;
	userInfo._errorMessage.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on('contacts:submit', () => {
	api
		.createOrder(appData.getOrder())
		.then((data) => {
			modal.render({
				content: orderSuccess.render(),
			});
			orderSuccess.total = data.total;
			appData.clearCart();
			appData.clearOrder();
			orderInfo.ClearAllAndClose();
			userInfo.ClearAllAndClose();
		})
		.catch(console.error)
});
