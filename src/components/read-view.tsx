import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "./ui/button";
import { SOURCE, URL } from "@/constants/source";
import { Chapter } from "@/types/chapter";

const ReadView: React.FC = () => {
  const [chapter, setChapter] = useState<Chapter>();

  const [currentChapterSlug, setCurrentChapterSlug] = useLocalStorage<string>(
    SOURCE.CURRENT_CHAPTER_SLUG,
    "chuong-1"
  );

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await fetch(URL.CHAPTERS(currentChapterSlug));
        if (response.status === 200) {
          const data = await response.json();
          setChapter(data);
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    // Call the fetchChapters function when the component mounts
    fetchChapter();
  }, [currentChapterSlug]);

  const renderButton = (
    <div className="flex flex-row justify-between gap-2 mt-4">
      <Button
        variant="outline"
        onClick={() => {
          setCurrentChapterSlug(chapter?.previousLink ?? "");
        }}
        disabled={!chapter?.previousLink}
      >
        Chap trước
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          setCurrentChapterSlug(chapter?.nextLink ?? "");
        }}
      >
        Chap sau
      </Button>
    </div>
  );
  return (
    <>
      {chapter && (
        <div className="space-y-4">
          {renderButton}
          <h6>{chapter?.title}</h6>
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
