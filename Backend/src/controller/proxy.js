import { mangaService } from "../client.js";

export const Proxy = async (req, res) => {
  const urlPath = decodeURIComponent(req.query.url);
  console.log(req.query);

  const data = (
    await mangaService.get(`${urlPath}`, {
      params: { title: req.params.title },
    })
  ).data;

  res.json({ data });
};
