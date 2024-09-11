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

export type TProductList = IProductList;

export type TPaymentMethod = Pick<IUser, 'payment' | 'address'>;

export type TUserInfo = Pick<IUser, 'email' | 'phone'>;

export type TOrder = Pick<IUser, 'total'>;

