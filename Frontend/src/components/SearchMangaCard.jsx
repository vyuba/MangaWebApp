import { Link } from "react-router";
import { useMangaImage } from "../contextApi/useMangaImage";
const apiUrl = import.meta.env.VITE_API_URL;

function SearchMangaCard({ manga }) {
  const mangaCoverId = manga.relationships.find(
    (rel) => rel.type === "cover_art"
  ).id;

  const coverFileNAme = useMangaImage(mangaCoverId);

  const imageSrc = `${apiUrl}/image-proxy?url=${manga.id}/${coverFileNAme}`;

  const mangaAttributes = {
    attributes: manga?.attributes,
    lastChapter: manga?.chapter,
    image: imageSrc,
    mangaId: manga?.id,
  };
  return (
    <Link state={mangaAttributes} to={`/dashboard/manga/${manga.id}`}>
      <div
        key={manga.id}
        className="max-w-[500px]  flex flex-row h-[300px] w-full gap-2"
      >
        <div className="img-container relative border-border border bg-secondary h-full min-w-[180px]">
          <img
            className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 object-cover"
            src={imageSrc}
            alt=""
          />
        </div>
        <div className="border-border border bg-secondary h-full w-full p-2 overflow-hidden flex flex-col gap-2 relative">
          <div className="">
            <span className="pr-2 font-semibold capitalize">manga titile:</span>
            <span>{manga?.attributes.title.en}</span>
          </div>
          <div className="">
            <span className="pr-2 font-semibold capitalize">description:</span>
            <span>{manga?.attributes.description.en}</span>
          </div>
          <span className="capitalize absolute bottom-0 border-border border-t p-2 bg-background w-full left-0">
            click to view
          </span>
        </div>
      </div>
    </Link>
  );
}

export default SearchMangaCard;
