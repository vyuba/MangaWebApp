import axios from "axios";
import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
export const useMangaTags = () => {
  const [mangaTag, setMangaTags] = useState(null);
  const [isLoadingMangaTags, setIsLoadingMangaTags] = useState(true);
  useEffect(() => {
    const fetchMangaTags = async () => {
      try {
        const response = await axios.get(`${apiUrl}/proxy?url=/manga/tag`);
        setIsLoadingMangaTags(false);
        setMangaTags(response.data.data.data);
      } catch (error) {
        console.log(`this error is from getting tags: ${error}`);
      }
    };
    fetchMangaTags();
  });

  return { mangaTag, isLoadingMangaTags };
};
