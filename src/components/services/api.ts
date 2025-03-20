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
      delay: 2000,
    },
  });
};
export const logoutApi = () => {
  const urlBackend = "/api/v1/auth/logout";
  return axios.post<IBackendRes<IFetchAccount>>(urlBackend);
};
export const getUsersApi = (query: string) => {
  const urlBackend = `/api/v1/user?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend);
};
