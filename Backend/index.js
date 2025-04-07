import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { Proxy } from "./src/controller/proxy.js";
import { chapImage, ImageProxy } from "./src/controller/imageProxy.js";

const PORT = 5100;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ name: "connected" });
});

//   working code for all proxy;

app.all("/proxy", Proxy);

//   working code for the all cover image proxy;

app.get("/image-proxy", ImageProxy);

//   working code for the all chapters images proxy;

app.get("/chap-image-proxy", chapImage);
app.listen(PORT, () => console.log(`app running on port ${PORT}`));

export default app;
