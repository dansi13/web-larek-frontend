export interface IProductItem {
    id: string;
    description : string;
    image : string;
    title : string;
    category: string;
    price : number;
}

export interface IUser {
    payment : string;
    email : string;
    phone : string;
    address : string;
    total: number;
    items : IProductItem[];
}

export interface IProductList {
    total: number;
    items: IProductItem[]
}

export interface IProductItemData {
    items: IProductItem[]
    preview: string | null;
    addProduct: (product: IProductItem) => void;
    getProduct: (productId: string) => IProductItem | null;
}

export interface IUserData {
    setPaymentMethod: (method: TPaymentMethod) => void;
    setUserInfo: (info: TUserInfo) => void;
    clearInfo: () => void;
}

export interface IBasketData {
    addProduct: (product: IProductItem) => void;
    getProducts: () => IProductItem[];
    removeProduct: (productId: string) => void;
    clearBasket: () => void;
}

export type TProductList = IProductList;

export type TPaymentMethod = Pick<IUser, 'payment' | 'address'>;

export type TUserInfo = Pick<IUser, 'email' | 'phone'>;

export type TOrder = Pick<IUser, 'total'>;

