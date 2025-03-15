import { Link } from "react-router";
import { useMangaImage } from "../contextApi/useMangaImage";
import { useManga } from "../contextApi/useManga";
const apiUrl = import.meta.env.VITE_API_URL;

function Card({ manga }) {
  const mangaTitle = manga.attributes.title.en;
  const mangaLastChapter = manga?.lastChapter;

  // const mangaCoverId = manga.relationships[2].id || null;
  const mangaCoverId = manga.relationships.find(
    (rel) => rel.type === "cover_art"
  ).id;

  const mangaId = manga.id;

  const coverFileNAme = useMangaImage(mangaCoverId);

  const imageSrc = `${apiUrl}/image-proxy?url=${mangaId}/${coverFileNAme}`;
  const forEachManga = useManga(mangaId);

  return (
    <Link to={`manga/${manga.id}`}>
      <div className="border-border border bg-secondary p-3 flex flex-col gap-3 max-w-full h-full">
        <div
          style={{
            backgroundImage: `url(${imageSrc})`,
          }}
          className="card-img w-full h-[250px] overflow-hidden  bg-cover bg-no-repeat"
        ></div>
        <div className="py-2">
          <h5 className="font-medium">{mangaTitle}</h5>
          <p className="font-light">
            Chapter: {forEachManga.manga?.attributes.lastChapter}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default Card;
