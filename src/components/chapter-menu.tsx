"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocalStorage } from "usehooks-ts";
import { SOURCE, URL } from "@/constants/source";
import { ChapterList, ChapterListItem } from "@/types/chapter";

export function ChapterMenu() {
  const [open, setOpen] = React.useState(false);
  const popoverTriggerRef = React.useRef<HTMLButtonElement>(null);
  const [localChapters, setLocalChapters] = useLocalStorage<ChapterList>(
    SOURCE.LOCAL_CHAPTERS,
    []
  );
  const [currentChapterSlug, setCurrentChapterSlug] = useLocalStorage(
    SOURCE.CURRENT_CHAPTER_SLUG,
    "chuong-1"
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

  const handleChapterSelect = (chapter: ChapterListItem) => {
    setCurrentChapterSlug(chapter.slug);
    setOpen(false);
  };

  const currentChapterInfo = localChapters.find(
    (chapter) => chapter.slug === currentChapterSlug
  );
  console.log("currentChapterInfo", currentChapterInfo);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild ref={popoverTriggerRef}>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {currentChapterInfo ? currentChapterInfo.title : "Select chapter..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        style={{ width: popoverTriggerRef.current?.offsetWidth }}
      >
        <Command>
          <CommandInput placeholder="Search chapter..." />
          <CommandList>
            <CommandEmpty>No chapter found.</CommandEmpty>
            <CommandGroup>
              {localChapters?.map((chapter) => (
                <CommandItem
                  key={chapter.slug}
                  value={chapter.title}
                  onSelect={() => handleChapterSelect(chapter)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentChapterInfo?.slug === chapter.slug
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  Chương {chapter.chapterNumber}: {chapter.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
