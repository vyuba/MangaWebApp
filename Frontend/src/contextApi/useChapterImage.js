import axios from "axios";
import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

export const useChapter = (chapterId) => {
  const [chapterData, setChapterData] = useState(null);
  useEffect(() => {
    const getChapterData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/proxy?url=/at-home/server/${chapterId}`
        );
        console.log(response);
        setChapterData(response.data.data);
      } catch (error) {
        console.error("Error fetching chapter data:", error);
      }
    };
    getChapterData();
  }, [chapterId]);
  return chapterData;
};
