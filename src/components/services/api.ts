import axios from "./axios.customize";

export const loginApi = (username: string, password: string) => {
  const urlBackend = "/api/v1/auth/login";
  return axios.post<IBackendRes<ILogin>>(
    urlBackend,
    { username, password },
    {
      headers: {
        delay: 2000,
      },
    }
  );
};

export const logoutApi = () => {
  const urlBackend = "/api/v1/auth/logout";
  return axios.post<IBackendRes<IFetchAccount>>(urlBackend);
};

export const registerApi = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  const urlBackend = "/api/v1/user/register";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    fullName,
    email,
    password,
    phone,
  });
};
export const fetchAccountApi = () => {
  const urlBackend = "/api/v1/auth/account";
  return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
    headers: {
      delay: 1000,
    },
  });
};

export const getUsersApi = (query: string) => {
  const urlBackend = `/api/v1/user?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
};
export const createUsersApi = (
  fullName: string,
  password: string,
  email: string,
  phone: string
) => {
  const urlBackend = "/api/v1/user";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    fullName,
    password,
    email,
    phone,
  });
};
export const updateUsersApi = (
  _id: string,
  fullName: string,
  phone: string
) => {
  const urlBackend = "/api/v1/user";
  return axios.put<IBackendRes<IUpdateUser>>(urlBackend, {
    _id,
    fullName,
    phone,
  });
};
export const deleteUsersApi = (_id: string) => {
  const urlBackend = `/api/v1/user/${_id}`;
  return axios.delete<IBackendRes<IUpdateUser>>(urlBackend);
};

export const bulkCreateUserAPI = (
  data: {
    fullName: string;
    password: string;
    email: string;
    phone: string;
  }[]
) => {
  const urlBackend = "/api/v1/user/bulk-create";
  return axios.post<IBackendRes<IResponseImport>>(urlBackend, data);
};

///////////////////////// book api

export const getBookApi = (query: string) => {
  const urlBackend = `/api/v1/book?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackend);
};

export const getCategoryApi = () => {
  const urlBackend = "/api/v1/database/category";
  return axios.get<IBackendRes<String[]>>(urlBackend);
};

export const createBookAPI = (
  mainText: string,
  author: string,
  price: number,
  quantity: number,
  category: string,
  thumbnail: string,
  slider: string[]
) => {
  const urlBackend = "/api/v1/book";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    mainText,
    author,
    price,
    quantity,
    category,
    thumbnail,
    slider,
  });
};

export const uploadFileAPI = (fileImg: any, folder: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios<
    IBackendRes<{
      fileUploaded: string;
    }>
  >({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": folder,
    },
  });
};

export const updateBookApi = (
  _id: string,
  thumbnail: string,
  slider: string[],
  mainText: string,
  author: string,
  price: number,
  quantity: number,
  category: string
) => {
  const urlBackend = `/api/v1/book/${_id}`;
  return axios.put<IBackendRes<IUpdateBook>>(urlBackend, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    quantity,
    category,
  });
};
export const deleteBookApi = (_id: string) => {
  const urlBackend = `/api/v1/book/${_id}`;
  return axios.delete<IBackendRes<IUpdateBook>>(urlBackend);
};
export const getBookByIdApi = (id: string) => {
  const urlBackend = `/api/v1/book/${id}`;
  return axios.get<IBackendRes<IBookTable>>(urlBackend, {
    headers: {
      delay: 2000,
    },
  });
};
/////////////////////// order
export const createOrderApi = (
  name: string,
  address: string,
  phone: string,
  totalPrice: number,
  type: string,
  detail: any
) => {
  const urlBackend = "/api/v1/order";

  return axios.post<IBackendRes<IBookTable>>(urlBackend, {
    name,
    address,
    phone,
    totalPrice,
    type,
    detail,
  });
};

export const getOrderHistoryApi = () => {
  const urlBackend = "/api/v1/history";
  return axios.get<IBackendRes<IHistory[]>>(urlBackend);
};

//////////////// profile
export const updateUserInfoAPI = (
  _id: string,
  avatar: string,
  fullName: string,
  phone: string
) => {
  const urlBackend = "/api/v1/user";
  return axios.put<IBackendRes<IRegister>>(urlBackend, {
    fullName,
    phone,
    avatar,
    _id,
  });
};

export const updateUserPasswordAPI = (
  email: string,
  oldpass: string,
  newpass: string
) => {
  const urlBackend = "/api/v1/user/change-password";
  return axios.post<IBackendRes<IRegister>>(urlBackend, {
    email,
    oldpass,
    newpass,
  });
};
///////////// order admin
export const getOrderApi = () => {
  const urlBackend = `/api/v1/order?current=1&pageSize=10`;
  return axios.get<IBackendRes<IModelPaginate<IOrder>>>(urlBackend);
};

export const getDashboardAPI = () => {
  const urlBackend = `/api/v1/database/dashboard`;
  return axios.get<
    IBackendRes<{
      countOrder: number;
      countUser: number;
      countBook: number;
    }>
  >(urlBackend);
};
