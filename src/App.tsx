/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { ChapterMenu } from "./components/chapter-menu";
import ReadView from "./components/read-view";
import { SOURCE } from "./constants/source";
import { useGetChapterParams } from "./hooks/use-chapter-param";

function App() {
  const chapter = useGetChapterParams();
  console.log("chapter", chapter);
  const [currentChapterSlug, setCurrentChapterSlug] = useLocalStorage(
    SOURCE.CURRENT_CHAPTER_SLUG,
    chapter ?? ""
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("chapter", currentChapterSlug);
    window.history.replaceState({}, "", `?${urlParams.toString()}`);
  }, [currentChapterSlug, setCurrentChapterSlug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentChapterSlug]);

  return (
    <div className="min-h-screen max-w-full  mx-auto overflow-x-hidden bg-[#EDD1B0] px-4 font-notoSerif text-2xl leading-10">
      <div className="max-w-4xl mx-auto pb-4">
        <ChapterMenu />
        <ReadView />
      </div>
    </div>
  );
}

export default App;
