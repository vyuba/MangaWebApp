import { Link, useNavigate, useParams } from "react-router";
// import { useManga } from "../contextApi/useManga";
import PageRouteName from "../components/PageRouteName";
import { useEffect, useState, useRef } from "react";
import { useAppContext } from "../AppProvider";
import { supabase } from "../api/endpoint";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocation } from "react-router";
import { Bookmark } from "lucide-react";
const apiUrl = import.meta.env.VITE_API_URL;
function MangaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    setAllMangaChapter,
    // bookmarkMangas,
    handleRemoveManga,
    handleAddManga,
    allBookmarkMangaChapter,
    setAllBookmarkMangaChapter,
    session,
  } = useAppContext();
  const [selectedLangauge, setSelectedLangauge] = useState("en");
  const [clickCount, setClickCount] = useState(0);
  const ref = useRef(null);

  const location = useLocation();
  const mangaDetails = location?.state?.attributes;
  const mangaImage = location?.state?.image;
  const mangaId = location?.state?.mangaId;
  // console.log(location.state);

  const fetchMangaChapter = async (mangaId, offsetParam) => {
    try {
      const response = await axios.get(`${apiUrl}/proxy?url=/chapter`, {
        params: {
          manga: mangaId,
          offset: offsetParam || null,
          translatedLanguage: [selectedLangauge],
        },
      });

      return response.data?.data?.data || [];
    } catch (error) {
      throw new Error("Failed to fetch Manga Chapters", error);
    }
  };

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isChaptersLoading,
    isError: chaptersError,
    data: custommangaChapters,
  } = useInfiniteQuery({
    queryKey: ["MangaChapter2", id, selectedLangauge],
    queryFn: async ({ pageParam }) => {
      const response = await fetchMangaChapter(id, pageParam, selectedLangauge);
      return { ...response, pageParam };
    },
    initialPageParam: 0,
    staleTime: 1000,
    cacheTime: 300000,
    retry: 2,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage) => {
      if (lastPage.response?.length === 0) {
        return undefined; // No more pages to fetch
      }
      return lastPage?.pageParam + 10;
    },
    getPreviousPageParam: (firstPage) => firstPage,
    maxPages: location?.lastChapter,
  });

  // console.log(custommangaChapters);

  useEffect(() => {
    allBookmarkMangaChapter.forEach((manga) => {
      if (manga.mangaId === mangaId) {
        setClickCount(1);
      }
    });

    const changes = supabase
      .channel("favourite-all-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "favouriteManga",
          filter: `user_id=eq.${session?.user?.id}`,
        },
        (payload) => {
          // console.log(payload);
          setAllBookmarkMangaChapter((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        "postgres_changes_delete",
        {
          event: "DELETE",
          schema: "public",
          table: "favouriteManga",
          filter: `user_id=eq.${session?.user?.id}`,
        },
        (payload) => {
          console.log(payload);
        }
      )
      .subscribe();

    if (!ref.current) return;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasNextPage) {
          console.log("Fetching next page...");
          fetchNextPage();
        }
      });
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect(), changes.unsubscribe();
    };
  }, [
    fetchNextPage,
    hasNextPage,
    setAllBookmarkMangaChapter,
    allBookmarkMangaChapter,
    mangaId,
    session,
  ]); // Removed `x` as it's unrelated

  // console.log(allBookmarkMangaChapter);

  // console.log(bookmarkMangas);
  const handleChange = (event) => {
    setSelectedLangauge(event.target.value);
    console.log(event.target.value);
  };

  // const { manga, isLoadingManga } = useManga(id);
  // console.log({ manga });
  const fetchMangaFeed = async (mangaId, selectedLangauge) => {
    try {
      const params = {
        limit: 500,
        // offset: 100,
        translatedLanguage: [selectedLangauge],
      };
      const response = await axios.get(
        `${apiUrl}/proxy?url=/manga/${mangaId}/feed`,
        { params }
      );
      // console.log(response);
      setAllMangaChapter(response.data?.data?.data);
      return response.data?.data?.data || []; // ✅ Return only the data
    } catch (error) {
      throw new Error("Failed to fetch Manga Feed", error); // ✅ Let React Query handle errors
    }
  };

  // ✅ Use separate useQuery calls for feed and chapters
  const {
    data: mangaFeed,
    isLoading: isFeedLoading,
    error: feedError,
  } = useQuery({
    queryKey: ["MangaFeed", id, selectedLangauge],
    queryFn: () => fetchMangaFeed(id, selectedLangauge),
    // staleTime: 1000,
    // cacheTime: 300000,
    // retry: 2,
    // refetchOnWindowFocus: false,
  });

  // console.log(mangaFeed);

  const allChapters =
    custommangaChapters?.pages
      .flatMap((page) => Object.values(page))
      .filter((chapter) => chapter.id) || [];

  // if (mangaFeed) {
  //   setAllMangaChapter(mangaFeed);
  // }

  return (
    <div className="w-full mangapage-ui">
      <PageRouteName manga={mangaDetails} />
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
      <button
        className="bg-secondary border-border border p-4 m-3"
        onClick={() => {
          if (session === null) {
            navigate("/auth/login");
            return;
          }
          if (clickCount === 1) {
            handleRemoveManga(mangaId, session?.user?.id);
            setClickCount(0);
          } else {
            handleAddManga(mangaId, session?.user?.id);
            setClickCount(1);
          }
        }}
      >
        <Bookmark
          className="transition-fill duration-75 ease-in"
          size={30}
          fill={`${clickCount === 0 ? "" : "white"}`}
        />
      </button>
      <div className="pt-3 capitalize">
        <div className="pb-4 w-full max-w-[1300px] overflow-hidden text-wrap">
          <span className="text-lg md:text-xl">Descriprion:</span>{" "}
          <span className="font-light leading-9 text-text opacity-[0.5] text-base md:text-lg">
            {mangaDetails?.description.en}
          </span>
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
            {allChapters
              ?.sort((a, b) => a.attributes?.chapter - b.attributes?.chapter)
              ?.map((data, index) => (
                <Link
                  className="w-full cursor-pointer bg-secondary p-3 border-border max-w-[500px] border"
                  key={index}
                  to={`/dashboard/manga/${id}/${mangaDetails?.title.en}/chapter/${data.id}`}
                >
                  <span className="">
                    {data?.attributes?.chapter}
                    {data?.attributes?.translatedLanguage}
                  </span>
                </Link>
              ))}
            <div className="" ref={ref}>
              {isFetchingNextPage
                ? "Fetching next page"
                : !hasNextPage
                ? "Next Page"
                : "you are all cut up "}
            </div>
          </div>
        )}
        {isFetchingNextPage && (
          <div className="flex flex-col gap-3">
            <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-full h-[50px] border border-border"></div>
            <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-full h-[50px] border border-border"></div>
            <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-full h-[50px] border border-border"></div>
            <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-full h-[50px] border border-border"></div>
            <div className="bg-gradient-to-br from-[#101228] via-[#181b3d] to-[#383f8e] searchLoader w-full h-[50px] border border-border"></div>
          </div>
        )}
        {chaptersError && (
          <div className="bg-secondary transition-all w-full border-red-500 border h-fit p-3 flex gap-2 flex-col">
            <p className="font-medium capitalize text-lg">error</p>
            <span className="capitalize">
              an error occured please bare with us
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MangaPage;

// .filter(
//   (language) =>
//     language.attributes.translatedLanguage === selectedLangauge
// )
// const {
//   data: mangaChapters,
//   isLoading: isChaptersLoading,
//   isError: chaptersError,
// } = useQuery({
//   queryKey: ["MangaChapter", id],
//   queryFn: () => fetchMangaChapter(id),
//   staleTime: 1000,
//   cacheTime: 300000,
//   retry: 2,
//   refetchOnWindowFocus: false,
// });
// console.log(error);
// console.log(mangaChapters);

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
