import { useState } from "react";
// import { AppContext } from './contextApi/useAppContext';

import { useContext, createContext } from "react";

// Create the Context
const appCcontext = createContext(null);

// Create a Provider component
const AppProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [sidebar, setSidebar] = useState(true);
  const [allMangaChapter, setAllMangaChapter] = useState([]);

  return (
    <appCcontext.Provider
      value={{
        search,
        setSearch,
        sidebar,
        setSidebar,
        allMangaChapter,
        setAllMangaChapter,
      }}
    >
      {children}
    </appCcontext.Provider>
  );
};
export default AppProvider;

export const useAppContext = () => useContext(appCcontext);
