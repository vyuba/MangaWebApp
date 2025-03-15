import { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
export const useMangaImage = (mangaCoverId) => {
  const [coverFileName, setCoverFileName] = useState();

  useEffect(() => {
    const getMangaImage = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/proxy?url=/cover/${mangaCoverId}`
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
