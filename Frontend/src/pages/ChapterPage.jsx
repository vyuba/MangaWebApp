import { LucideArrowBigUp } from "lucide-react";
import { useChapter } from "../contextApi/useChapterImage";
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAppContext } from "../AppProvider";
const apiUrl = import.meta.env.VITE_API_URL;
function ChapterPage() {
  const { chapterId, mangaId, mangaTitle } = useParams();
  const navigate = useNavigate();
  const { allMangaChapter, setAllMangaChapter } = useAppContext();
  const chapterData = useChapter(chapterId);
  console.log(chapterData);
  const hash = chapterData?.chapter.hash;
  const initialChapter = allMangaChapter.find(
    (chapter) => chapter.id === chapterId
  );

  const [selectedOption, setSelectedOption] = useState(
    initialChapter?.attributes.chapter || ""
  );

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
    const newChapter = allMangaChapter.find(
      (data) => data.attributes.chapter === e.target.value
    );
    navigate(`/manga/${mangaId}/${mangaTitle}/chapter/${newChapter?.id}`);
  };

  const container = document.querySelector("#content-container");

  const scrollToTop = () => {
    container.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="chapter-container flex flex-col gap-4 relative h-full">
      <span className="capitalize text-2xl font-semibold py-4">
        {mangaTitle}
      </span>
      <div className="w-full ">
        <button
          onClick={scrollToTop}
          className="fixed text-text bottom-4 right-4 bg-secondary border border-border"
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
            {allMangaChapter
              .filter(
                (language) => language.attributes.translatedLanguage === "en"
              )
              .sort((a, b) => a.attributes.chapter - b.attributes.chapter)
              .map((data) => (
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
      <div className="flex flex-col w-full max-w-[1200px] mx-auto">
        {chapterData?.chapter.data.map((value, index) => (
          <img
            key={index}
            src={`${apiUrl}/chap-image-proxy?url=data/${hash}/${value}`}
            alt=""
          />
        ))}
      </div>
    </div>
  );
}

export default ChapterPage;
