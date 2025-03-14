import axios from "axios";
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

const token = localStorage.getItem("token");

export const service = axios.create({
  baseURL: "https://auth.mangadex.org",
});

service.interceptors.request.use(
  (config) => {
    const accessToken = token;
    if (accessToken) {
      config.headers.common = { Authorization: `Bearer ${accessToken}` };
    }

    console.log({ config });

    return config;
  },
  (error) => {
    Promise.reject(error.response || error.message);
  }
);

service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let originalRequest = error.config;
    let refreshToken = refreshToken;
    if (
      refreshToken &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      return axios
        .post(
          `https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token`,
          {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            password: "Psych1234_",
            client_id: clientId,
            client_secret: clientSecret,
          }
        )
        .then((res) => {
          if (res.status === 200) {
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${res.data.accessToken}`;

            return axios(originalRequest);
          }
        })
        .catch(() => {
          localStorage.clear();
          location.reload();
        });
    }
    return Promise.reject(error.response || error.message);
  }
);
