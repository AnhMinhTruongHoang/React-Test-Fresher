export {};

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }
  interface ILogin {
    access_token: string;
    user: {
      email: string;
      phone: string;
      fullName: string;
      role: string;
      avatar: string;
      id: string;
    };
  }
  interface IRegister {
    _id: string;
    fullName: string;
    email: string;
  }
  interface IUpdateUser {
    _id: string;
    fullName: string;
    phone: string;
  }

  interface IUser {
    email: string;
    phone: string;
    fullName: string;
    role: string;
    avatar: string;
    id: string;
    oldpass: string;
    newpass: string;
  }

  interface IFetchAccount {
    user: IUser;
  }

  interface IUserTable {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IResponseImport {
    countSuccess: number;
    countError: number;
    detail: any;
  }

  //////////// book

  interface IBookTable {
    _id: string;
    thumbnail: string;
    slider: string[];
    mainText: string;
    author: string;
    price: number;
    sold: number;
    quantity: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface IUpdateBook {
    _id: string;
    thumbnail: string;
    slider: string[];
    mainText: string;
    author: string;
    price: number;
    quantity: number;
    category: string;
  }

  interface ICart {
    _id: string;
    quantity: number;
    detail: IBookTable;
  }
  interface IHistory {
    _id: string;
    name: string;
    type: string;
    email: string;
    phone: string;
    userId: string;
    detail: {
      bookName: string;
      quantity: number;
      _id: string;
    }[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface IOrderDetail {
    _id: string;
    bookName: string;
    quantity: number;
    price: string;
  }

  export interface IOrder {
    _id: string;
    name: string;
    address: string;
    phone: string;
    type: "COD" | "BANKING" | string;
    paymentStatus: "PAID" | "UNPAID" | string;
    paymentRef: string;
    detail: IOrderDetail[];
    totalPrice: number;
    createdAt: string | Date;
    updatedAt: string | Date;
    userId?: string;
    email?: string;
  }
}
