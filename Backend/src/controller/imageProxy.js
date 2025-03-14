const mangaService = require("../client");
// const ImageProxy = async (req, res) => {
//   try {
//     const imagePath = decodeURIComponent(req.query.url);
//     console.log(`https://uploads.mangadex.org/covers/${imagePath}`);
//     const mangaImage = await axios.get(
//       `https://uploads.mangadex.org/covers/${imagePath}`,
//       { responseType: "stream" }
//     );

//     // Set content type and pipe the image data
//     res.setHeader("Content-Type", mangaImage.headers["content-type"]);
//     mangaImage.data.pipe(res);
//   } catch (error) {
//     console.log({ imageProxyError: error });

//     // console.error("Error fetching manga image:", error);
//     res.status(500).json({ error: "Failed to fetch manga image." });
//   }
// };
