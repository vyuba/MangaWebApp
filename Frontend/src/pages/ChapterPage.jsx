import { CircleOffIcon, LucideArrowBigUp } from "lucide-react";
// import { useChapter } from "../contextApi/useChapterImage";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import { useAppContext } from "../AppProvider";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
const apiUrl = import.meta.env.VITE_API_URL;
import SpinnerIcon from "../components/SpinnerIcon";
function ChapterPage() {
  const { chapterId, mangaId, mangaTitle } = useParams();
  const [isImageLoading, setImageIsLoading] = useState(true);
  const [nextChapterIndex, setNextChapterIndex] = useState(0);
  const [prevChapterIndex, setPrevChapterIndex] = useState(0);
  const navigate = useNavigate();
  const { allMangaChapter } = useAppContext();
  const [initialChapter, setInitialChapter] = useState(null);

  const getChapterData = async (chapterId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/proxy?url=/at-home/server/${chapterId}`
      );
      // console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching chapter data:", error);
    }
  };

  // Fetching data using React Query's useQuery

  const {
    data: chapterData,
    error: chapterDataError,
    isLoading,
  } = useQuery({
    queryKey: ["chapterData", mangaId, chapterId],
    queryFn: () => getChapterData(chapterId),
    staleTime: Infinity,
    cacheTime: 300000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const [selectedOption, setSelectedOption] = useState(
    initialChapter?.attributes.chapter || ""
  );

  // console.log(chapterData);
  const hash = chapterData?.chapter?.hash;
  const baseUrl = chapterData?.baseUrl;
  const arrangedMangaChapter = allMangaChapter.sort(
    (a, b) => a.attributes.chapter - b.attributes.chapter
  );
  const index = arrangedMangaChapter.indexOf(initialChapter);
  const prevChapter = arrangedMangaChapter[index - 1];
  const nextChapter = arrangedMangaChapter[index + 1];
  // const hindex = arrangedMangaChapter.indexOf(prevChapter);
  // console.log(index);
  // console.log(hindex);
  // console.log(prevChapter);
  //  setNextChapterIndex(nextChaperIndex);

  useEffect(() => {
    const initialChapter = arrangedMangaChapter.find(
      (chapter) => chapter.id === chapterId
    );
    setInitialChapter(initialChapter);
    setSelectedOption(initialChapter?.attributes.chapter || "");
    setPrevChapterIndex(arrangedMangaChapter.indexOf(prevChapter));
    setNextChapterIndex(arrangedMangaChapter.indexOf(nextChapter));
  }, [
    chapterId,
    arrangedMangaChapter,
    setPrevChapterIndex,
    prevChapter,
    nextChapter,
  ]);
  // console.log(initialChapter);

  const NextChapter = () => {
    if (index !== -1 && index < arrangedMangaChapter.length - 1) {
      const nextChapter = arrangedMangaChapter[index + 1];

      navigate(
        `/dashboard/manga/${mangaId}/${mangaTitle}/chapter/${nextChapter.id}`
      );
    } else {
      return null;
    }
  };
  const PrevChapter = () => {
    if (index !== -1 && index < arrangedMangaChapter.length - 1) {
      const prevChapter = arrangedMangaChapter[index - 1];

      navigate(
        `/dashboard/manga/${mangaId}/${mangaTitle}/chapter/${prevChapter.id}`
      );
    } else {
      return null;
    }
  };

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
    const newChapter = allMangaChapter.find(
      (data) => data.attributes.chapter === e.target.value
    );
    navigate(
      `/dashboard/manga/${mangaId}/${mangaTitle}/chapter/${newChapter?.id}`
    );
  };

  const container = document.querySelector("#content-container");

  const scrollToTop = () => {
    container.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <div>
        loading data ... <SpinnerIcon />{" "}
      </div>
    );
  }

  // console.log(allMangaChapter);
  return (
    <div className="chapter-container flex flex-col gap-4 relative h-full">
      <span className="capitalize text-2xl font-semibold py-4">
        {mangaTitle}
      </span>
      <span className="capitalize text-2xl font-semibold py-4">
        {initialChapter?.attributes?.title}
      </span>
      <div className="w-full ">
        <button
          onClick={scrollToTop}
          className="fixed text-text z-50 bottom-4 right-4 bg-secondary border border-border"
        >
          <LucideArrowBigUp size={"50px"} className="p-3" />
        </button>
        <div>
          <select
            id="options"
            value={selectedOption}
            onChange={handleChange}
            className="w-full max-w-[500px] py-2 outline-none border border-border bg-secondary capitalize  focus:ring-indigo-500"
          >
            {arrangedMangaChapter.map((data) => (
              <option
                key={data.id}
                className="capitalize"
                value={data.attributes.chapter}
              >
                Chapter : {data.attributes.chapter}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col w-full gap-2 max-w-[1200px] mx-auto">
        {chapterDataError && <p>{chapterDataError}</p>}
        {chapterData?.chapter?.data?.map((jpg, index) => (
          <div key={index} className="w-full h-full">
            {/* Shimmer container (Visible only when loading) */}
            {isImageLoading && (
              <div className=" bg-[#090A15]  w-full h-[500px] flex items-center justify-center relative">
                <p
                  style={{
                    fontSize: `clamp(18px, 20vw, 70px)`,
                    WebkitTextStroke: `1px var(--border-color)`,
                  }}
                  className="font-bold text-background"
                >
                  {index}
                </p>
              </div>
            )}

            {/* Image (Hidden until loaded) */}
            <img
              onLoad={() => setImageIsLoading(false)}
              src={`${apiUrl}/chap-image-proxy?url=${baseUrl}/data/${hash}/${jpg}`}
              alt=""
              className={`w-full h-full transition-all duration-500`}
            />
          </div>
        ))}
      </div>
      {chapterData?.chapter?.data && (
        <div className="w-fulll h-full flex flex-row">
          <button
            disabled={prevChapterIndex === -1}
            className={`w-full py-20 h-full flex-[40%] border border-border  ${
              prevChapterIndex === -1
                ? "bg-[#090A15]/20 cursor-not-allowed"
                : "bg-[#090A15]"
            }  flex items-center justify-center capitalize text-lg`}
            onClick={PrevChapter}
          >
            {prevChapterIndex === -1 ? (
              <CircleOffIcon />
            ) : (
              <p className="text-text">prev</p>
            )}
          </button>
          <button
            disabled={nextChapterIndex === -1}
            className={`w-full py-20 h-full flex-[60%] border border-border ${
              nextChapterIndex === -1
                ? "bg-[#090A15]/20 cursor-not-allowed"
                : "bg-[#090A15]"
            }  flex items-center justify-center capitalize text-lg`}
            onClick={NextChapter}
          >
            {nextChapterIndex === -1 ? (
              <CircleOffIcon />
            ) : (
              <p className="text-text">next</p>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default ChapterPage;
