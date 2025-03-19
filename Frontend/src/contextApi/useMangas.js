// import { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
export const useMangas = () => {
  const fetchMangas = async () => {
    try {
      const response = await axios.get(`${apiUrl}/proxy?url=/manga/`, {
        params: {
          limit: 10,
          offset: 2,
        },
      });

      return response.data.data.data;
    } catch (error) {
      console.error(error);
    }
  };

  return { fetchMangas };
};
