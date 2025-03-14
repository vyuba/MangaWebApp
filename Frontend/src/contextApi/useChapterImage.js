import axios from "axios";
import { useEffect, useState } from "react";

export const useChapter = (chapterId) => {
  const [chapterData, setChapterData] = useState(null);
  useEffect(() => {
    const getChapterData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/proxy?url=/at-home/server/${chapterId}`
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
