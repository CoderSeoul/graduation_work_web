import axios from 'axios';

const RequestApi = axios.create();

RequestApi.defaults.baseURL = 'https://graduationwork.herokuapp.com/';

RequestApi.interceptors.request.use(
  (config) => {
    const accessToken = window.localStorage.getItem('token');
    const authToken = accessToken && `Bearer ${accessToken}`;
    const isLoginURL = config.url && config.url.includes('authentication');
    const isRegisterURL =
      config.url && config.url.includes('devices') && config.method === 'get';
    if (authToken && (isLoginURL === false || isRegisterURL === false)) {
      config.headers.Authorization = authToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const NOT_AUTHORIZED_HTTP_CODE = 401;

RequestApi.interceptors.response.use(
  (response) => {
    if (response && response.config.method !== 'get') {
      // message.success("요청이 성공적으로 처리되었습니다.", 1.5);
    }
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (response && response.status === NOT_AUTHORIZED_HTTP_CODE) {
      // message.error("로그인기간이 만료되었습니다. 다시 로그인해주세요.", 1.5);
      return Promise.reject(error);
    }
    // message.error("요청이 실패하였습니다.", 1.5);
    return Promise.reject(error);
  }
);

export default RequestApi;
