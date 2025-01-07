export type ChapterListItem = {
  href: string;
  title: string;
  chapterNumber: string;
  slug: string;
  currentLink: string;
  nextLink: string | null;
};

export type ChapterList = ChapterListItem[];

export type Chapter = {
  href: string;
  title: string;
  chapterNumber: string;
  slug: string;
  previousLink: string | null;
  currentLink: string;
  nextLink: string | null;
  contentHTML: string;
};
