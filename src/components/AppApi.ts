import { IProductItem, ICart, TOrder, IUser, TPaymentMethod, IApi, TUserInfo } from "../types";
import { IEvents } from "./base/events";
import { EMAIL_REGEXP, TEL_REGEXP } from "../utils/constants";
import { Api, ApiListResponse } from "./base/api";

export interface IAppApi {
    getProductList: () => Promise<IProductItem[]>;
	getProduct: (id: string) => Promise<IProductItem>;
	createOrder: (order: TOrder) => Promise<TOrder>;
}
export class AppApi extends Api implements IAppApi {
    cdn: string;
    private _baseApi: IApi;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}
    getProductList: () => Promise<IProductItem[]>;

    getProducts(): Promise<IProductItem[]> {
        return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
    }

    getProduct(productId: string): Promise<IProductItem> {
        return this.get(`/product/${productId}`).then((item: IProductItem) => ({
			...item,
			image: this.cdn + item.image,
		}));
    }

    createOrder(order: object): Promise<TOrder> {
        return this.post(`/order`, order).then((data: TOrder) => data);
    }
}