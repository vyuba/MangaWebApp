import { Link } from "react-router";
import { useMangaImage } from "../contextApi/useMangaImage";
import { useManga } from "../contextApi/useManga";
const apiUrl = import.meta.env.VITE_API_URL;
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

function Card({ manga }) {
  const [isImageLoaded, setImageIsLoaded] = useState(false);
  const mangaTitle = manga?.attributes?.title?.en;
  // const mangaLastChapter = manga?.lastChapter;

  // const mangaCoverId = manga.relationships[2].id || null;
  const mangaCoverId = manga?.relationships.find(
    (rel) => rel.type === "cover_art"
  ).id;

  const lastUpadatedId = manga?.attributes?.latestUploadedChapter;

  const mangaId = manga?.id;

  const { isPending, error, data } = useQuery({
    queryKey: ["manga Chapter", mangaId],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/proxy?url=/chapter/${lastUpadatedId}`
        );

        console.log(response.data);

        return {
          chapter: response.data.data.data.attributes.chapter,
          title: response.data.data.data.attributes.title,
        };
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    staleTime: 1000,
    cacheTime: 300000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // console.log(data);

  const coverFileNAme = useMangaImage(mangaCoverId);

  const imageSrc = `${apiUrl}/image-proxy?url=${mangaId}/${coverFileNAme}`;
  const mangaAttributes = {
    attributes: manga?.attributes,
    image: imageSrc,
  };
  // const forEachManga = useManga(mangaId);

  return (
    <Link state={mangaAttributes} to={`manga/${manga?.id}`}>
      <div className="border-border border bg-secondary p-3 flex flex-col gap-3 max-w-full h-full relative">
        <div className="capitalize border-border border bg-background p-2 absolute top-0 right-0 z-10">
          {manga?.attributes?.status}
        </div>
        <div className=" w-full h-[250px] overflow-hidden  relative">
          {/* {!isImageLoaded ? (
            <div className="card-img w-full h-full overflow-hidden bg-cover bg-no-repeat bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader"></div>
          ) : ( */}
          <img
            onLoad={() => setImageIsLoaded(true)}
            src={imageSrc}
            className="inset-0 absolute w-full h-full object-cover"
            alt={data?.title}
          />
          {/* )} */}
        </div>
        <div className="py-2 flex flex-col gap-2">
          <span className="font-medium">
            {isPending ? (
              <span className="font-light w-full h-3 bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader"></span>
            ) : (
              <p className="capitalize">
                title:{" "}
                {data?.title === null
                  ? "Sorry The Api I Am Using is Crappy they Did not Provide the manga title"
                  : data?.title}
              </p>
            )}
          </span>
          <span className="font-light">
            {/* Chapter: {forEachManga.manga?.attributes.lastChapter} */}
            {isPending ? (
              <span className="font-light w-full h-3 bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader"></span>
            ) : (
              <p>Chapter: {data?.chapter}</p>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default Card;
