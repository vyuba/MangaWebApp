import { useEffect, useState } from "react";
import axios from "axios";

export const useMangas = () => {
  const [mangas, setMangas] = useState(null);
  const [isLoadingMangas, setIsLoadingMangas] = useState(true);

  const fetchMangas = async () => {
    const response = await axios.get("http://localhost:5000/proxy?url=/manga/");
    setMangas(response.data.data.data);
    setIsLoadingMangas(false);
    console.log({ mang: response });
  };
  useEffect(() => {
    fetchMangas();
  }, []);

  return { mangas, setMangas, isLoadingMangas };
};
