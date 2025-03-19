import { useState, useEffect } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const useSearchManga = (title) => {
  const [isLoadingManga, setIsLoadingManga] = useState(false);
  const [isErrorManga, setIsErrorManga] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const searchManga = async () => {
      if (!title) return; // Ensure title is provided before making the request

      setIsLoadingManga(true);
      setIsErrorManga(false);
      try {
        const response = await axios.get(`${apiUrl}/proxy?url=/manga`, {
          params: { title: title },
        });
        const resultSearch = response.data.data.data;
        setSearchResult(resultSearch);
        // console.log(response);
        setIsLoadingManga(false);
      } catch (error) {
        setIsLoadingManga(false);
        // console.error("Error fetching manga:", error);
        setSearchResult(null);
        setIsErrorManga(true);
      }
    };

    searchManga();
  }, [title]); // Re-run when the `title` changes

  return { searchResult, isLoadingManga, isErrorManga };
};
