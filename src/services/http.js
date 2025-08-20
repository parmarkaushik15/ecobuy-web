import axios from 'axios';

function getToken() {
  const cname = 'token';
  if (typeof window !== 'undefined') {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
  return '';
}

const baseURL = process.env.BASE_URL;
const http = axios.create({
  baseURL: baseURL + `/api`,
  timeout: 30000,
  withCredentials: true
});

let csrfToken = null;

export async function initCsrf() {
  try {
    const { data } = await http.get('/csrf-token');
    csrfToken = data?.csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
}

http.interceptors.request.use(
  async (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const method = config.method?.toLowerCase();
    if (['post', 'put', 'delete', 'patch'].includes(method)) {
      if (!csrfToken) {
        await initCsrf();
      }
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }

    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
export default http;
