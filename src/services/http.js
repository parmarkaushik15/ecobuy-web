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

const baseURL =
  process.env.BASE_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://ecobuy-api.vercel.app' : 'http://localhost:5500');
const http = axios.create({
  baseURL: baseURL + `/api`,
  timeout: 30000,
  withCredentials: true
});

let csrfToken = null;

export async function initCsrf() {
  try {
    console.log('Fetching CSRF token from:', baseURL + '/csrf-token');
    const { data } = await http.get('/csrf-token');
    csrfToken = data?.csrfToken;
    console.log('CSRF token fetched successfully');
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    // Retry once after a short delay
    setTimeout(async () => {
      try {
        const { data } = await http.get('/csrf-token');
        csrfToken = data?.csrfToken;
        console.log('CSRF token fetched on retry');
      } catch (retryError) {
        console.error('Failed to fetch CSRF token on retry:', retryError);
        // Set a flag to indicate CSRF is not working
        window.__CSRF_FAILED__ = true;
      }
    }, 1000);
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
        console.log('No CSRF token found, initializing...');
        await initCsrf();
      }
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
        console.log('CSRF token added to request headers');
      } else {
        console.warn('No CSRF token available for request');
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
