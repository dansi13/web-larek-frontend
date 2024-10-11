//  

export interface IProductItem {
    id: string;
    description : string;
    image : string;
    title : string;
    category: string;
    price : number | null;
}

export interface IUser {
    payment : string;
    email : string;
    phone : string;
    address : string;
}

export interface ICart {
    find(arg0: (item: { id: IProductItem; }) => boolean): unknown;
    items : IProductItem[];
    total : number;
}

export interface IUserData {
    setPaymentMethod: (method: TPaymentMethod) => void;
    setUserInfo: (info: TUserInfo) => void;
    clearInfo: () => void;
}

export interface ICartData {
    addProduct: (product: IProductItem) => void;
    getProducts: () => IProductItem[];
    removeProduct: (productId: string) => void;
    clearCart: () => void;
}

export type TPaymentMethod = 'cash' | 'card';

//export type TOrderInfo = Pick<IUser, 'payment' | 'address'>;
export interface TOrderInfo {
    payment: TPaymentMethod;
    address: string;
}

export type TUserInfo = Pick<IUser, 'email' | 'phone'>;

export type TOrder = Pick<ICart, 'total'>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
