import { useState } from "react";
// import { AppContext } from './contextApi/useAppContext';

import { useContext, createContext, useReducer } from "react";

// Create the Context
const appCcontext = createContext(null);

// Create a Provider component
const AppProvider = ({ children }) => {
  const initialTasks = [];
  const [search, setSearch] = useState("");
  const [sidebar, setSidebar] = useState(true);
  const [allMangaChapter, setAllMangaChapter] = useState([]);
  const [bookmarkMangas, dispatch] = useReducer(
    handleBookmarkManga,
    initialTasks
  );

  function handleBookmarkManga(state, action) {
    switch (action.type) {
      case "ADD_MANGA": {
        return [...state, action.payload]; // return added state
      }
      case "REMOVE_MANGA": {
        const updatedBookmark = state.filter((manga) =>
          console.log(`filter function`, manga !== action.payload)
        );
        return updatedBookmark; // return updated state
      }
      default:
        return state; // return state
    }
  }

  function handleAddManga(mangaId) {
    dispatch({
      type: "ADD_MANGA",
      payload: mangaId,
    });
  }
  function handleRemoveManga(mangaId) {
    dispatch({
      type: "REMOVE_MANGA",
      payload: mangaId,
    });
  }

  return (
    <appCcontext.Provider
      value={{
        search,
        setSearch,
        sidebar,
        setSidebar,
        allMangaChapter,
        setAllMangaChapter,
        bookmarkMangas,
        handleRemoveManga,
        handleAddManga,
      }}
    >
      {children}
    </appCcontext.Provider>
  );
};
export default AppProvider;

export const useAppContext = () => useContext(appCcontext);
