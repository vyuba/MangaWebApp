import axios from "axios";

const ImageProxy = async (req, res) => {
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
};

const chapImage = async (req, res) => {
  let success = false;
  const startTime = performance.now();
  let totalBytes = 0;
  try {
    const imagePath = decodeURIComponent(req.query.url);
    const imageUrl = `${imagePath}`; // Added this line
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
};

export { ImageProxy, chapImage };
