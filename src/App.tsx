/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";
import { useLocalStorage } from "usehooks-ts";
import { ChapterMenu } from "./components/chapter-menu";
import ReadView from "./components/read-view";
import { SOURCE } from "./constants/source";

function App() {
  const [currentLink] = useLocalStorage(SOURCE.CURRENT_CHAPTER_SLUG, "chuong-1");

  const contentRef = useRef<HTMLDivElement>(null);
  // Scroll to top when chapter changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentLink]);

  return (
    <div
      className="min-h-screen max-w-full  mx-auto overflow-x-hidden bg-[#EDD1B0] px-4"
      ref={contentRef}
    >
      <div className="max-w-3xl mx-auto">
        <ChapterMenu />
        <ReadView />
      </div>
    </div>
  );
}

export default App;
