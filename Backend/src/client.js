import axios from "axios";
import qs from "qs";

let accessToken = null;
let refreshToken = null;

const getAuth = async () => {
  const credentials = qs.stringify({
    grant_type: process.env.GRANT_TYPE,
    username: process.env.CLIENT_USERNAME,
    password: process.env.CLIENT_PASSWORD,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  });

  // console.log({ credentials });

  const response = await axios.post(
    "https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token",
    credentials,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  accessToken = response.data.access_token;
  refreshToken = response.data.refresh_token;

  //   console.log({ accessToken, refreshToken });

  //   console.log("Tokens fetched successfully");
};

export const mangaService = axios.create({
  baseURL: "https://api.mangadex.org",
  headers: {
    "User-Agent": "MangaGeek",
  },
});
``;
mangaService.interceptors.request.use(
  async (config) => {
    if (accessToken) {
      config.headers.common = { Authorization: `Bearer ${accessToken}` };
      return config;
    }

    await getAuth();

    config.headers.common = {
      Authorization: `Bearer ${accessToken}`,
    };

    return config;
  },
  (error) => {
    Promise.reject(error.response || error.message);
  }
);

mangaService.interceptors.response.use(
  (response) => response,
  async (error) => {
    // console.log(JSON.stringify(error, null, 2));
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const credentials = qs.stringify({
          grant_type: "refresh_token",
          refreshToken,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
        });

        const response = await axios.post(
          "https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token",
          credentials,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        accessToken = response.data.access_token;
        refreshToken = response.data.refresh_token;

        mangaService.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        console.log("Token refreshed Successfully");
        return mangaService(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        accessToken = null;
        refreshToken = null;
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
