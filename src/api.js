// api.js
// new backend add
const API_URL = "http://localhost:3001";

export const userApi = {
  login: `${API_URL}/user/login`,
  list: 'https://grizzlysms.com/api/country/get-prices/22?page=1&wholesale=0&user=guest'
};

export const adminApi = {
  login: `${API_URL}/admin/login`,
  dashboard: `${API_URL}/admin/earnings`
};

export const numberApi = {
    me: `${API_URL}/user/me`,
    getNumber: `${API_URL}/api/getNumber`,
    getOtp: `${API_URL}/api/getOtp`,
    cancelNumber: `${API_URL}/api/cancelNumber`,
    resendOtp: `${API_URL}/api/resendOtp`,
    getPrice: `${API_URL}/getCountryServiceList`,
    getService: `${API_URL}/service/get-all`
  };