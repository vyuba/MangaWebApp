import { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
// 07251805-a27e-4d59-b488-f0bfbec15168
export const useMangasOtherTags = (tags) => {
  const [mangas, setMangas] = useState(null);
  const [isLoadingMangas, setIsLoadingMangas] = useState(true);

  const fetchMangas = async () => {
    const response = await axios.get(`${apiUrl}/proxy?url=/manga/`, {
      params: {
        includedTags: [tags],
      },
    });
    setMangas(response.data.data.data);
    setIsLoadingMangas(false);
    // console.log({ mang: response });
  };
  useEffect(() => {
    fetchMangas();
  }, []);

  return { mangas, setMangas, isLoadingMangas };
};
