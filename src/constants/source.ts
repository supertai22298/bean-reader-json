export const SOURCE = {
  LOCAL_CHAPTERS: "local_chapters",
  LOCAL_FOLDER: "nga-duc-phong-thien",
  CURRENT_CHAPTER_SLUG: "currentChapterSlug",
};

export const URL = {
  CHAPERLIST: `${SOURCE.LOCAL_FOLDER}/chapter-list.json`,
  CHAPTERS: (filename: string) => `${SOURCE.LOCAL_FOLDER}/chapters/${filename}.json`,
};
