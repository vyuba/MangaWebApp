import { Link, useParams } from "react-router";
// import { useManga } from "../contextApi/useManga";
import PageRouteName from "../components/PageRouteName";
import { useState } from "react";
import { useAppContext } from "../AppProvider";
import { useQuery, useQueries } from "@tanstack/react-query";
import axios from "axios";
import { useLocation } from "react-router";
const apiUrl = import.meta.env.VITE_API_URL;
function MangaPage() {
  const { id } = useParams();
  const { allMangaChapter, setAllMangaChapter } = useAppContext();
  const [selectedLangauge, setSelectedLangauge] = useState("en");
  console.log(selectedLangauge);
  const handleChange = (event) => {
    setSelectedLangauge(event.target.value);
  };

  const location = useLocation();
  const mangaDetails = location.state.attributes;
  const mangaImage = location.state.image;
  console.log(location.state);

  // const { manga, isLoadingManga } = useManga(id);
  // console.log({ manga });
  const fetchMangaFeed = async (mangaId) => {
    try {
      const params = {
        // limit: 0,
        // offset: 100,
        translatedLanguage: ["en"],
      };
      const response = await axios.get(
        `${apiUrl}/proxy?url=/manga/${mangaId}/feed`,
        { params }
      );
      console.log(response);
      return response.data?.data?.data || []; // ✅ Return only the data
    } catch (error) {
      throw new Error("Failed to fetch Manga Feed"); // ✅ Let React Query handle errors
    }
  };

  const fetchMangaChapter = async (mangaId) => {
    try {
      const response = await axios.get(`${apiUrl}/proxy?url=/chapter`, {
        params: {
          manga: mangaId,
          translatedLanguage: ["en"],
        },
      });
      console.log(response);
      return response.data?.data?.data || [];
    } catch (error) {
      throw new Error("Failed to fetch Manga Chapters");
    }
  };

  // ✅ Use separate useQuery calls for feed and chapters
  const {
    data: mangaFeed,
    isLoading: isFeedLoading,
    error: feedError,
  } = useQuery({
    queryKey: ["MangaFeed", id],
    queryFn: () => fetchMangaFeed(id),
    staleTime: 1000,
    cacheTime: 300000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const {
    data: mangaChapters,
    isLoading: isChaptersLoading,
    error: chaptersError,
  } = useQuery({
    queryKey: ["MangaChapter", id],
    queryFn: () => fetchMangaChapter(id),
    staleTime: 1000,
    cacheTime: 300000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  console.log(mangaChapters);

  // if (isPending) {
  //   return (
  //     <>
  //       <div className="w-full md:w-fit h-fit xs:h-[300px] overflow-hidden flex gap-1  flex-col xs:flex-row">
  //         <div className="xs:flex-1 h-[400px] md:flex-0 md:w-[200px]  xs:h-full bg-secondary p-2 border-border border  relative overflow-hidden">
  //           <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] px-10 searchLoader w-[full] h-full border border-border"></div>
  //         </div>
  //         <div className="xs:flex-1 md:flex-0 h-fit xs:h-full bg-secondary border-border border p-2">
  //           <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] px-10 searchLoader w-full h-full border border-border"></div>
  //         </div>
  //       </div>
  //       <div className="pt-8 capitalize">
  //         <div className="pb-4 w-full max-w-[1300px] overflow-hidden text-wrap">
  //           <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-[120px] h-[20px] border border-border"></div>
  //           <div className="py-4 flex flex-col gap-3">
  //             <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-[220px] h-[20px] border border-border"></div>
  //             <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-[220px] h-[20px] border border-border"></div>
  //             <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-[220px] h-[20px] border border-border"></div>
  //             <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-[220px] h-[20px] border border-border"></div>
  //           </div>
  //         </div>
  //         <div className="flex flex-col gap-3">
  //           <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-full h-[50px] border border-border"></div>
  //           <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-full h-[50px] border border-border"></div>
  //           <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-full h-[50px] border border-border"></div>
  //           <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-full h-[50px] border border-border"></div>
  //           <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-full h-[50px] border border-border"></div>
  //         </div>
  //       </div>
  //     </>
  //   );
  // }
  // const imageUrl = `${apiUrl}/image-proxy?url=${id}/${manga.coverFileName}`;
  // const mangaChapters = manga.mangaFeed.data.data.data;
  // setAllMangaChapter(mangaChapters);
  // console.log(allMangaChapter);
  // const mangaVolumesArray = Object.entries(manga.mangaDetails.volumes);
  // // console.log(chaptersArray);
  // const tags = manga.attributes.tags;
  return (
    <div className="w-full">
      {/* <PageRouteName manga={manga} /> */}
      <div className="w-full md:w-fit h-fit xs:h-[300px] overflow-hidden flex gap-1  flex-col xs:flex-row">
        <div className="xs:flex-1 h-[400px] md:flex-0 md:w-[200px]  xs:h-full bg-secondary border-border border  relative overflow-hidden">
          <img
            className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 object-cover"
            src={mangaImage}
            alt=""
          />
        </div>
        <div className="xs:flex-1 md:flex-0 h-fit xs:h-full bg-secondary border-border border p-2">
          <div className="w-full h-full capitalize">
            <h1 className="font-medium text-2xl border-b pb-1 border-border">
              {mangaDetails?.title.en}
            </h1>
            <ul className="pt-1 flex flex-col gap-2">
              <li>Last chapter : {mangaDetails?.lastChapter}</li>
              <li>Last chapter : {mangaDetails?.lastVolume}</li>
              <li>updated at : {mangaDetails?.updatedAt}</li>
              <li>since year : {mangaDetails?.year}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="pt-8 capitalize">
        <div className="pb-4 w-full max-w-[1300px] overflow-hidden text-wrap">
          <span className="text-lg md:text-xl">Descriprion:</span>{" "}
          <span className="font-light leading-9 text-text opacity-[0.5] text-base md:text-lg">
            {mangaDetails?.description.en}
          </span>
          {/* <div className="py-4">
            <span className="">About author:</span>
            <div className="flex flex-wrap flex-col gap-2 w-full pt-1">
              <span>Name: {manga.mangaAuthor.attributes.name}</span>
              <div className=" text-white flex flex-col gap-2">
                <span className="">Links :</span>
                <ul className="flex flex-row flex-wrap gap-3">
                  <li>
                    {manga.mangaAuthor.attributes?.twitter ? (
                      <a
                        className=""
                        href={manga.mangaAuthor.attributes?.twitter}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          role="img"
                          viewBox="0 0 24 24"
                          className="stroke-white w-5 h-5"
                        >
                          <title>X</title>
                          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                        </svg>
                      </a>
                    ) : (
                      ""
                    )}
                  </li>
                  <li>
                    {manga.mangaAuthor.attributes?.youtube ? (
                      <a
                        className=""
                        href={manga.mangaAuthor.attributes?.youtube}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="stroke-white w-5 h-5"
                          role="img"
                          viewBox="0 0 24 24"
                        >
                          <title>YouTube</title>
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </a>
                    ) : (
                      ""
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div> */}
          <div>
            <span className="">tags:</span>
            <ul className="flex flex-wrap gap-2 w-full pt-4">
              {mangaDetails?.tags.map((genre, index) => (
                <li
                  className="p-2 border-border border w-fit bg-secondary hover:bg-accent cursor-pointer"
                  key={index}
                >
                  {genre.attributes.name.en}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2 py-3">
          <label className="" htmlFor="options">
            select your preferred language :
          </label>
          <select
            name=""
            id="options"
            value={selectedLangauge}
            onChange={handleChange}
            className="bg-secondary border border-border p-1 w-fit"
          >
            {mangaDetails?.availableTranslatedLanguages.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        {/* <div className="w-full gap-1 pt-2">
          {mangaVolumesArray.map(([key, volumeData]) => (
            <div className="" key={key}>
              Volume: {volumeData.volume}
              <div className="flex flex-wrap gap-2 pb-2">
                Chapters:{" "}
                {Object.values(volumeData.chapters).map((chapter, index) => (
                  <Link
                    className="w-full cursor-pointer bg-secondary p-3 border-border max-w-[500px] border"
                    key={chapter.id}
                    to={`/manga/${manga.id}/${manga.attributes.title.en}/chapter/${chapter.id}`}
                  >
                    <span className="">{chapter.chapter}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div> */}
        <span className="font-medium text-lg">chapters</span>
        {isChaptersLoading ? (
          <div className="flex flex-col gap-3">
            <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-full h-[50px] border border-border"></div>
            <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-full h-[50px] border border-border"></div>
            <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-full h-[50px] border border-border"></div>
            <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-full h-[50px] border border-border"></div>
            <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-full h-[50px] border border-border"></div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 py-4">
            {mangaChapters
              .sort((a, b) => a.attributes.chapter - b.attributes.chapter)
              .map((data, index) => (
                <Link
                  className="w-full cursor-pointer bg-secondary p-3 border-border max-w-[500px] border"
                  key={index}
                  to={`/manga/${id}/${mangaDetails?.title.en}/chapter/${data.id}`}
                >
                  <span className="">
                    {data.attributes.chapter}{" "}
                    {data.attributes.translatedLanguage}
                  </span>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
// .filter(
//   (language) =>
//     language.attributes.translatedLanguage === selectedLangauge
// )

export default MangaPage;
