import { SearchIcon } from "lucide-react";
import { useAppContext } from "../AppProvider";
import { useSearchManga } from "../contextApi/useSearchManga";
import { Link } from "react-router";
import { useMangaImage } from "../contextApi/useMangaImage";
import { useState, useMemo } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

function SearchInput() {
  const { search, setSearch } = useAppContext();
  const [coverArtId, setCoverArtId] = useState(null);
  const [imageSrc, setImageSrc] = useState("");

  const { searchResult, isLoadingManga, isErrorManga } = useSearchManga(search);
  const coverFileName = useMangaImage(coverArtId);

  // debounce function

  const DebounceFunc = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(...args), delay);
    };
  };

  // Compute derived state directly
  useMemo(() => {
    if (searchResult && searchResult.length > 0) {
      const mangaCoverId = searchResult[0]?.relationships.find(
        (rel) => rel.type === "cover_art"
      )?.id;

      if (mangaCoverId) {
        setCoverArtId(mangaCoverId);
        setImageSrc(
          `${apiUrl}/image-proxy?url=${searchResult[0]?.id}/${coverFileName}`
        );
      }
    }
  }, [searchResult, coverFileName]);

  return (
    <>
      <div className="flex flex-1 flex-col gap-2 relative  max-w-[700px]">
        <div className="bg-secondary border-border border flex flex-row p-3 gap-2">
          <SearchIcon />
          <input
            className="bg-transparent border-l-2 border-border pl-2 w-full outline-none"
            type="text"
            name="search"
            onChange={(e) => DebounceFunc(setSearch(e.target.value), 1000)}
            id="search"
            value={search}
            placeholder="Search for manga..."
          />
        </div>
        {search !== "" && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 w-full h-screen -z-10"></div>
            {isErrorManga && (
              <div className="bg-secondary transition-all w-full top-[60px] absolute border-red-500 border h-fit p-3 flex gap-2 flex-col">
                <p className="font-medium capitalize text-lg">error</p>
                <span className="capitalize">
                  an error occured please bare with us
                </span>
              </div>
            )}
            {isLoadingManga && (
              <div className="bg-secondary transition-all w-full top-[60px] absolute border-border border h-fit p-3 flex gap-2 flex-col">
                <p className="font-medium capitalize text-lg">Searching</p>
                <div className="w-full">
                  <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-[120px] h-[150px] border border-border"></div>
                </div>
                <span className="capitalize ">searching</span>
              </div>
            )}
            {searchResult !== null && (
              <div className="bg-secondary transition-all w-full top-[60px] absolute border-border border h-fit p-3 flex gap-2 flex-col">
                <p className="font-medium capitalize text-lg">result</p>
                <div className="w-full">
                  <div
                    style={{
                      backgroundImage: `url(${imageSrc})`,
                    }}
                    className="bg-cover w-[120px] h-[150px] border border-border"
                  ></div>
                </div>
                <span className="text-sm">
                  {searchResult[0]?.attributes.title.en}
                </span>
                <Link className="capitalize underline" to={"/search"}>
                  click here to view all
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SearchInput;
