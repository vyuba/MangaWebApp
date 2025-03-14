import { useEffect, useState } from "react";
import axios from "axios";

export const useMangaImage = (mangaCoverId) => {
  const [coverFileName, setCoverFileName] = useState();

  useEffect(() => {
    const getMangaImage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/proxy?url=/cover/${mangaCoverId}`
        );

        const fileName = response.data.data.data.attributes?.fileName;
        setCoverFileName(fileName);
      } catch (error) {
        console.error("Error fetching manga image:", error);
      }
    };

    getMangaImage();
  }, [mangaCoverId]);

  return coverFileName;
};
