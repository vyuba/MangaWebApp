import { mangaService } from "../client.js";

export const Proxy = async (req, res) => {
  try {
    const urlPath = decodeURIComponent(req.query.url);
    console.log("Requesting:", urlPath);

    const response = await mangaService.get(urlPath, {
      headers: {
        "User-Agent": req.headers["user-agent"] || "MangaGeek",
      },
      params: req.query.title ? { title: req.query.title } : {},
    });

    res.json({ data: response.data });
  } catch (error) {
    console.error("Proxy Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: "Proxy request failed",
      details: error.response?.data || error.message,
    });
  }
};
