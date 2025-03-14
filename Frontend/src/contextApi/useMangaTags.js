import axios from "axios";
import { useEffect, useState } from "react";

export const useMangaTags = () => {
  const [mangaTag, setMangaTags] = useState(null);
  const [isLoadingMangaTags, setIsLoadingMangaTags] = useState(true);
  useEffect(() => {
    const fetchMangaTags = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/proxy?url=/manga/tag"
        );
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
