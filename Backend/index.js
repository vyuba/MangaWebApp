import axios from "axios";
import qs from "qs";
import "dotenv/config";
import express, { response } from "express";
import cors from "cors";

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

const PORT = 5000;

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.json({ name: "connected" });
});

app.all("/proxy", async (req, res) => {
  const urlPath = decodeURIComponent(req.query.url);
  console.log(req.query);

  const data = (
    await mangaService.get(`${urlPath}`, {
      params: { title: req.params.title },
    })
  ).data;

  const manga = (await mangaService.get(`manga/${data.data[0].id}`)).data;
  console.log({ manga: manga.data.attributes });

  // const mangas = await axios.get(
  //   "https://api.mangadex.org/manga/6676aef9-cf30-4950-9a20-e0382b5e7447",
  //   res.setHeader("Content-Type", mangas.headers["content-type"]),
  //   "https://uploads.mangadex.org/covers/e79405c8-0936-4f17-9035-8ced2307ba5f/9e641e85-b741-486a-a221-85d1a0e9e8d6.png",
  //   { responseType: "stream" }
  // );

  // res.setHeader("Content-Type", mangas.headers["content-type"]);
  // mangas.data.pipe(res);
  // res.status(200).json({ mangas });
});

// app.get("/Image-proxy", async (req, res) => {
//   const imagePath = decodeURIComponent(req.query.url);
//   const mangaImage = await axios.get(
//     `https://uploads.mangadex.org/covers/${imagePath}`,
//     {
//       responseType: "stream",
//     }
//   );

//   res.setHeader("Content-Type", mangaImage.headers["content-type"]);
//   mangaImage.data.pipe(res);
//   res.status(200).json({ mangaImage });
// });

app.get("/image-proxy", async (req, res) => {
  try {
    const imagePath = decodeURIComponent(req.query.url);
    console.log(`https://uploads.mangadex.org/covers/${imagePath}`);
    const mangaImage = await axios.get(
      `https://uploads.mangadex.org/covers/${imagePath}`,
      { responseType: "stream" }
    );

    // Set content type and pipe the image data
    res.setHeader("Content-Type", mangaImage.headers["content-type"]);
    mangaImage.data.pipe(res);
  } catch (error) {
    console.log({ imageProxyError: error });

    // console.error("Error fetching manga image:", error);
    res.status(500).json({ error: "Failed to fetch manga image." });
  }
});

app.get("/chap-image-proxy", async (req, res) => {
  const startTime = performance.now();
  let totalBytes = 0;
  let success = false;
  try {
    const imagePath = decodeURIComponent(req.query.url);
    const imageUrl = `https://uploads.mangadex.org/${imagePath}`; // Added this line
    console.log(imageUrl);

    const mangaImage = await axios.get(imageUrl, {
      responseType: "stream",
      onDownloadProgress: (progressEvent) => {
        totalBytes = progressEvent.loaded;
      },
    });

    success = mangaImage.status >= 200 && mangaImage.status < 300; // Fixed variable name

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    // Set content type and pipe the image data
    res.setHeader("Content-Type", mangaImage.headers["content-type"]);
    mangaImage.data.pipe(res);

    // Moved reporting outside of res.pipe to ensure it doesn't block
    try {
      await axios.post(
        "https://api.mangadex.network/report",
        {
          url: imageUrl,
          success: true,
          bytes: totalBytes,
          duration,
          cached: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (reportError) {
      console.error("MangaDex reporting error:", reportError);
    }
  } catch (error) {
    console.log({ imageProxyError: error });
    res.status(500).json({ error: "Failed to fetch manga image." });

    // Report failure to MangaDex
    try {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      await axios.post(
        "https://api.mangadex.network/report",
        {
          url: imageUrl, // Make sure imageUrl is defined
          success: false,
          bytes: totalBytes,
          duration,
          cached: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (reportError) {
      console.error("MangaDex failure reporting error:", reportError);
    }
  }
});

app.listen(PORT, () => console.log(`app running on port ${PORT}`));

// import fs from "fs";
//
// const readableStream = fs.createReadStream("t.js", "UTF-8");
// const writableStream = fs.createWriteStream("output.js");
//
// readableStream.on("data", (chunk) => {
//   console.log(chunk);
// });
//
// fs.createF
//
// readableStream.pipe(writableStream);
