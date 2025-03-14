import { SearchIcon } from "lucide-react";
// import { useMangaTags } from "../contextApi/useMangaTags";
import { useAppContext } from "../AppProvider";
import { useSearchManga } from "../contextApi/useSearchManga";
import { useMangaImage } from "../contextApi/useMangaImage";
import SearchMangaCard from "../components/SearchMangaCard";
useMangaImage;

function SearchPage() {
  const { search, setSearch } = useAppContext();
  // const { mangaTag, isLoadingMangaTags } = useMangaTags();
  //   console.log(mangaTag[0].attributes.name.en);
  // setSearch("attack on titan");
  const { searchResult, isLoadingManga } = useSearchManga(search);

  const MangaList = searchResult?.map((manga) => {
    return <SearchMangaCard key={manga.id} manga={manga} />;
  });

  console.log(searchResult);
  // const mangaCoverId = searchResult.relationships.find(
  //   (rel) => rel.type === "cover_art"
  // ).id;

  // // console.log(mangaCoverId);

  // const coverFileNAme = useMangaImage(mangaCoverId);

  // const imageSrc = `http://localhost:5000/image-proxy?url=${searchResult.id}/${coverFileNAme}`;
  return (
    <div>
      <div className="bg-secondary border-border border flex flex-row p-3 gap-2">
        <SearchIcon />
        <input
          className="bg-transparent border-l-2 border-border pl-2 w-full outline-none"
          type="text"
          name="search"
          id="search"
          placeholder="Search for manga..."
        />
      </div>
      <div className="flex flex-col gap-3 pt-4">
        <span>Filters:</span>
        <ul className="flex flex-wrap gap-2">
          {/* {mangaTag?.map((tags, index) => (
            <li
              key={index}
              className="border-border border bg-secondary w-fit  p-3 rounded-2xl capitalize"
            >
              {tags.attributes.name.en}
            </li>
          ))} */}
          <li className="border-border border bg-secondary w-fit  p-3 rounded-2xl capitalize">
            slice of life
          </li>
        </ul>
      </div>
      <div className="searchResults flex flex-wrap pt-4 gap-3">
        {isLoadingManga &&
          Array(10)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="flex max-w-[500px] flex-row h-[300px] w-full gap-2"
              >
                <div className="img-container relative border-border border bg-secondary h-full min-w-[180px] p-2">
                  <div className=" w-full h-full  bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader" />
                </div>
                <div className="border-border border bg-secondary h-full w-full p-2 overflow-hidden">
                  <div className=" w-full h-full  bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader" />
                </div>
              </div>
            ))}
        {MangaList}
        {/* {searchResult?.map((manga, index) => (
          <div key={index} className="flex flex-row h-[300px] w-full gap-2">
            <div className="img-container relative border-border border bg-secondary h-full min-w-[180px]">
              <img
                className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 object-cover"
                src={"imageSrc"}
                alt=""
              />
            </div>
            <div className="border-border border bg-secondary h-full w-full p-2 overflow-hidden">
              <div>
                <span className="capitalize">manga titile:</span>
                <span>{manga?.attributes.title.en}</span>
              </div>
              <div>
                <span className="capitalize">description:</span>
                <span>{manga?.attributes.description.en}</span>
              </div>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
}

export default SearchPage;
{
  /* <div className="border-border border bg-secondary h-full w-full p-2 overflow-hidden">
  <div>
    <span className="capitalize">manga titile:</span>
    <span>{searchResult?.resultSearch[0]?.attributes.title.en}</span>
  </div>
  <div>
    <span className="capitalize">description:</span>
    <span>
    {searchResult?.resultSearch[0]?.attributes.description.en}
    </span>
    </div> */
}
