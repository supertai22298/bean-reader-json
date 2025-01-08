import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "./ui/button";
import { SOURCE, URL } from "@/constants/source";
import { Chapter, ChapterList } from "@/types/chapter";
import { useGetChapterParams } from "@/hooks/use-chapter-param";
import { LoaderCircleIcon } from "lucide-react";

const ReadView: React.FC = () => {
  const [chapter, setChapter] = useState<Chapter>();
  const [loading, setLoading] = useState(false);
  const chapterParams = useGetChapterParams();
  const [currentChapterSlug, setCurrentChapterSlug] = useLocalStorage<string>(
    SOURCE.CURRENT_CHAPTER_SLUG,
    chapterParams
  );
  const [localChapters] = useLocalStorage<ChapterList>(
    SOURCE.LOCAL_CHAPTERS,
    []
  );

  const previousChapterSlug = chapter?.chapterNumber
    ? localChapters.find(
        (c) => c.slug === `chuong-${parseInt(chapter.chapterNumber) - 1}`
      )?.slug
    : null;

  const nextChapterSlug = chapter?.chapterNumber
    ? localChapters.find(
        (c) => c.slug === `chuong-${parseInt(chapter.chapterNumber) + 1}`
      )?.slug
    : null;

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true);
        const response = await fetch(URL.CHAPTERS(currentChapterSlug));
        if (response.status === 200) {
          const data = await response.json();
          setChapter(data);
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetchChapters function when the component mounts
    fetchChapter();
  }, [currentChapterSlug]);

  const renderButton = (
    <div className="flex flex-row justify-between gap-2 my-4">
      <Button
        variant="outline"
        onClick={() => {
          if (previousChapterSlug) {
            setCurrentChapterSlug(previousChapterSlug);
          }
        }}
        disabled={!previousChapterSlug}
      >
        Chap trước
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          if (nextChapterSlug) {
            setCurrentChapterSlug(nextChapterSlug);
          }
        }}
        disabled={!nextChapterSlug}
      >
        Chap sau
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderCircleIcon className="animate-spin text-blue-500" />
      </div>
    );
  }
  return (
    <>
      {chapter && (
        <div className="space-y-4">
          {renderButton}
          <h6 className="font-bold">
            {chapter?.title.includes("chuong")
              ? `${chapter?.title}`
              : `Chương ${chapter?.chapterNumber}: ${chapter?.title}`}
          </h6>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: chapter?.contentHTML }}
          ></div>
          {renderButton}
        </div>
      )}
    </>
  );
};

export default ReadView;
