import { useState, useEffect } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const useManga = (mangaId) => {
  const [manga, setManga] = useState(null);
  const [isLoadingManga, setIsLoadingManga] = useState(true);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const managaResonse = await axios.get(
          `${apiUrl}/proxy?url=/manga/${mangaId}`
        );

        const mangaData = managaResonse.data.data.data;

        const mangaCoverId = mangaData.relationships.find(
          (rel) => rel.type === "cover_art"
        ).id;

        const coverResponse = await axios.get(
          `${apiUrl}/proxy?url=/cover/${mangaCoverId}`
        );

        const coverFileName = coverResponse.data.data.data.attributes.fileName;

        const mangaDetailsResponse = await axios.get(
          `${apiUrl}/proxy?url=manga/${mangaId}/aggregate`
          // {
          //   params: {
          //     translatedLanguage: "en",
          //   },
          // }
        );
        console.log(mangaDetailsResponse);
        const mangaDetails = mangaDetailsResponse.data.data;

        const mangaAuthorId = mangaData.relationships.find(
          (rel) => rel.type === "author"
        ).id;

        const mangaAuthorResponse = await axios.get(
          `${apiUrl}/proxy?url=/author/${mangaAuthorId}`
        );

        const mangaAuthor = mangaAuthorResponse.data.data.data;

        const params = {
          limit: 500,
          offset: 100,
          translatedLanguage: ["en"],
        };

        const mangaFeed = await axios.get(
          `${apiUrl}/proxy?url=/manga/${mangaId}/feed`,
          {
            params,
          }
        );

        const mangaChapters = await axios.get(`${apiUrl}/proxy?url=/chapter`, {
          params: {
            manga: mangaId,
            translatedLanguage: ["en"],
          },
        });

        setManga({
          ...mangaData,
          mangaChapters,
          mangaFeed,
          coverFileName,
          mangaDetails,
          mangaAuthor,
        });
        setIsLoadingManga(false);
      } catch (error) {
        console.error("Error fetching manga image:", error);
      }
    };
    fetchManga();
  }, [mangaId]);

  return { manga, setManga, isLoadingManga };
};
