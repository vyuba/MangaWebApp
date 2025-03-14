import { SearchIcon } from "lucide-react";
import { useAppContext } from "../AppProvider";
import { useSearchManga } from "../contextApi/useSearchManga";
import { Link } from "react-router";
import { useMangaImage } from "../contextApi/useMangaImage";
import { useState, useMemo } from "react";

function SearchInput() {
  const { search, setSearch } = useAppContext();
  const [coverArtId, setCoverArtId] = useState(null);
  const [imageSrc, setImageSrc] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e);
  };

  console.log(search);

  const { searchResult, isLoadingManga, isErrorManga } = useSearchManga(search);
  const coverFileName = useMangaImage(coverArtId);

  // Compute derived state directly
  useMemo(() => {
    if (searchResult && searchResult.length > 0) {
      const mangaCoverId = searchResult[0]?.relationships.find(
        (rel) => rel.type === "cover_art"
      )?.id;

      if (mangaCoverId) {
        setCoverArtId(mangaCoverId);
        setImageSrc(
          `http://localhost:5000/image-proxy?url=${searchResult[0]?.id}/${coverFileName}`
        );
      }
    }
  }, [searchResult, coverFileName]);
  return (
    <div className="flex flex-1 flex-col gap-2 relative max-w-[700px]">
      <div className="bg-secondary border-border border flex flex-row p-3 gap-2">
        <SearchIcon />
        <input
          className="bg-transparent border-l-2 border-border pl-2 w-full outline-none"
          type="text"
          name="search"
          onChange={(e) => handleSearchChange(e.target.value)}
          id="search"
          value={search}
          placeholder="Search for manga..."
        />
      </div>
      {isErrorManga && (
        <div className="bg-secondary transition-all w-full top-[60px] absolute border-red-500 border h-fit p-3 flex gap-2 flex-col">
          <p className="font-medium capitalize text-lg">error</p>
          {/* <div className="w-full">
            <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-[120px] h-[150px] border border-border"></div>
          </div> */}
          <a className="capitalize underline" href="">
            an error occured please bare with us
          </a>
        </div>
      )}
      {isLoadingManga && (
        <div className="bg-secondary transition-all w-full top-[60px] absolute border-border border h-fit p-3 flex gap-2 flex-col">
          <p className="font-medium capitalize text-lg">Searching</p>
          <div className="w-full">
            <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-[120px] h-[150px] border border-border"></div>
          </div>
          <a className="capitalize underline" href="">
            click here to view all
          </a>
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
    </div>
  );
}

export default SearchInput;
