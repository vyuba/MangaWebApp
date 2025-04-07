import { useState, useEffect } from "react";
import { supabase } from "./api/endpoint";
// import { AppContext } from './contextApi/useAppContext';

import { useContext, createContext } from "react";

// Create the Context
const appCcontext = createContext(null);

// Create a Provider component
const AppProvider = ({ children }) => {
  // const initialTasks = [];
  const [search, setSearch] = useState("");
  const [sidebar, setSidebar] = useState(true);
  const [allMangaChapter, setAllMangaChapter] = useState([]);
  const [allBookmarkMangaChapter, setAllBookmarkMangaChapter] = useState([]);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  // const navigate = useNavigate();
  useEffect(() => {
    const fetchFavouriteManga = async (id) => {
      const { data, error } = await supabase
        .from("favouriteManga")
        .select("*")
        .eq("user_id", id);

      if (error) {
        console.error("Error fetching favourite manga:", error);
      } else {
        setAllBookmarkMangaChapter(data);
      }
    };
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      if (session) {
        fetchFavouriteManga(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchFavouriteManga(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleAddManga(mangaId) {
    const { error } = await supabase
      .from("favouriteManga")
      .insert({ mangaId, user_id: session?.user.id })
      .select();

    if (!error) {
      // dispatch({ type: "ADD_MANGA", payload: mangaId });
    } else {
      console.error("Error adding manga:", error);
    }
  }
  async function handleRemoveManga(mangaId, id) {
    const { error } = await supabase
      .from("favouriteManga")
      .delete()
      .eq("mangaId", mangaId, "user_id", id);

    if (!error) {
      // dispatch({
      //   type: "REMOVE_MANGA",
      //   payload: mangaId,
      // });
    } else {
      console.error("Error deleting manga:", error);
    }
  }

  // console.log(session);

  return (
    <appCcontext.Provider
      value={{
        user,
        setUser,
        session,
        setSession,
        allBookmarkMangaChapter,
        setAllBookmarkMangaChapter,
        search,
        setSearch,
        sidebar,
        setSidebar,
        allMangaChapter,
        setAllMangaChapter,
        // bookmarkMangas,
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
