import { mangaService } from "../client.js";

export const Proxy = async (req, res) => {
  try {
    const urlPath = decodeURIComponent(req.query.url);
    console.log("Requesting:", urlPath);

    const response = await mangaService.get(urlPath, {
      params: {
        title: req.query.title || undefined,
        limit: req.query.limit || 10,
        offset: req.query.offset || 0,
        manga: req.query.manga || undefined,
        translatedLanguage: req.query.translatedLanguage || undefined,
      },
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
