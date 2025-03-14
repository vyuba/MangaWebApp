import { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const useMangas = () => {
  const [mangas, setMangas] = useState(null);
  const [isLoadingMangas, setIsLoadingMangas] = useState(true);

  const fetchMangas = async () => {
    const response = await axios.get(`${apiUrl}/proxy?url=/manga/`);
    setMangas(response.data.data.data);
    setIsLoadingMangas(false);
    console.log({ mang: response });
  };
  useEffect(() => {
    fetchMangas();
  }, []);

  return { mangas, setMangas, isLoadingMangas };
};
