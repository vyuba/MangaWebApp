import { useState, useEffect } from "react";
import axios from "axios";

export const useManga = (mangaId) => {
  const [managaFeed, setMangaFeed] = useState(null);
  const [isLoadingManga, setIsLoadingManga] = useState(true);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/proxy?url=/manga/${mangaId}/feed`
        );
        setMangaFeed(response);
        setIsLoadingManga(false);
      } catch (error) {
        console.error("Error fetching manga image:", error);
      }
    };
    fetchManga();
  }, [mangaId]);

  return { managaFeed, setMangaFeed, isLoadingManga };
};
