"use client";

import * as React from "react";
import { useLocalStorage } from "usehooks-ts";
import { SOURCE, URL } from "@/constants/source";
import { ChapterList } from "@/types/chapter";
import { VirtualizedCombobox } from "./ui/virtual-combobox";
import { useGetChapterParams } from "@/hooks/use-chapter-param";

export function ChapterMenu() {
  const [localChapters, setLocalChapters] = useLocalStorage<ChapterList>(
    SOURCE.LOCAL_CHAPTERS,
    []
  );
  const [currentChapterSlug, setCurrentChapterSlug] = useLocalStorage(
    SOURCE.CURRENT_CHAPTER_SLUG,
    useGetChapterParams()
  );

  React.useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(URL.CHAPERLIST, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("fetchData", data);
        setLocalChapters(data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    if (localChapters.length === 0) {
      fetchChapters();
    }
  }, []);

  const handleChapterSelect = (value: string) => {
    setCurrentChapterSlug(value);
  };

  return (
    <VirtualizedCombobox
      options={localChapters.map((chapter) => ({
        value: chapter.slug,
        label: chapter.title.includes("Chương")
          ? chapter.title
          : `Chương ${chapter.chapterNumber}: ${chapter.title}`,
      }))}
      onChangeOption={handleChapterSelect}
      selectedOption={currentChapterSlug}
    />
  );
}
