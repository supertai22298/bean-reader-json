export const useGetChapterParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const chapter = urlParams.get("chapter");

  return chapter ?? "chuong-1";
};
