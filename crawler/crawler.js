const puppeteer = require("puppeteer");
const { promises: fs } = require("fs");
const antibotbrowser = require("antibotbrowser");

const TOTAL_PAGES = 49;
const chapterUrl = (index) =>
  `https://truyenyy.vip/truyen/nga-duc-phong-thien/danh-sach-chuong/?p=${index}`;

async function crawlChapters() {
  const antibrowser = await antibotbrowser.startbrowser(9222);

  const browser = await puppeteer.connect({
    browserWSEndpoint: antibrowser.websokcet,
  });

  const page = await browser.newPage();
  const chapters = [];

  try {
    for (let i = 1; i <= TOTAL_PAGES; i++) {
      console.log(`Crawling page ${i}/${TOTAL_PAGES}`);

      await page.goto(chapterUrl(i), { waitUntil: "networkidle0" });

      const chapterLinks = await page.$$eval("a.table-chap-title", (links) =>
        links.map((link) => ({
          href: link.href,
          title: link.textContent,
          chapterNumber: link.href.match(/chuong-(\d+)/)?.[1] || "",
          slug: link.href.split("/").pop().replace(".html", ""),
          currentLink: link.href,
          nextLink: null, // Will be updated in post-processing
        }))
      );

      chapters.push(...chapterLinks);
    }

    // Update nextLink references
    for (let i = 0; i < chapters.length - 1; i++) {
      chapters[i].nextLink = chapters[i + 1].currentLink;
    }

    // Save to file
    await fs.writeFile(
      "public/nga-duc-phong-thien/chapter-list.json",
      JSON.stringify(chapters, null, 2),
      { encoding: "utf-8", flag: "w" }
    );

    console.log(`Successfully saved ${chapters.length} chapters`);
  } catch (error) {
    console.error("Error during crawling:", error);
  } finally {
    await browser.close();
  }
}

async function crawlChapterContent() {
  const antibrowser = await antibotbrowser.startbrowser(9222);
  const browser = await puppeteer.connect({
    browserWSEndpoint: antibrowser.websokcet,
  });
  const page = await browser.newPage();

  try {
    // Read chapter list
    const chapterList = JSON.parse(
      await fs.readFile("public/nga-duc-phong-thien/chapter-list.json", "utf-8")
    );

    for (const chapter of chapterList) {
      const filePath = `public/nga-duc-phong-thien/chapters/${chapter.slug}.json`;

      try {
        // Check if file exists and size
        try {
          const stats = await fs.stat(filePath);
          if (stats.size > 5000) {
            console.log(`Skipping ${chapter.slug} - already exists`);
            continue;
          }
        } catch (err) {
          // File doesn't exist, continue to crawl
        }

        console.log(`Crawling content for ${chapter.slug}`);
        await page.goto(chapter.href, { waitUntil: "networkidle0" });

        // Extract chapter content
        // Update the content extraction part
        const content = await page.$eval(
          "div#inner_chap_content_1 div",
          (el) => {
            // Remove ads and clean content in the browser context
            const removeSelectors = [
              "script",
              "iframe",
              "ins",
              "div",
              '[style*="display: none"]',
            ];

            removeSelectors.forEach((selector) => {
              el.querySelectorAll(selector).forEach((node) => node.remove());
            });

            // Remove style attributes
            el.querySelectorAll("[style]").forEach((node) =>
              node.removeAttribute("style")
            );

            return el.innerHTML;
          }
        );

        const chapterData = {
          ...chapter,
          contentHTML: content,
        };

        // Save to file
        await fs.writeFile(
          filePath,
          JSON.stringify(chapterData, null, 2),
          "utf-8"
        );

        // Random delay between requests (1-3 seconds)
        await new Promise((r) => setTimeout(r, 0));
      } catch (error) {
        console.error(`Error crawling chapter ${chapter.slug}:`, error);
      }
    }
  } catch (error) {
    console.error("Error in crawlChapterContent:", error);
  } finally {
    await browser.close();
  }
}


async function createDefaultContentForMissingChapters() {
  try {
    // Read chapter list
    const chapterList = JSON.parse(
      await fs.readFile("public/nga-duc-phong-thien/chapter-list.json", "utf-8")
    );
    const errChapters = []
    for (const chapter of chapterList) {
      const filePath = `public/nga-duc-phong-thien/chapters/${chapter.slug}.json`;

      try {
        await fs.access(filePath);
      } catch (err) {
        // File doesn't exist, create default content
        
        errChapters.push(chapter.slug)
        
        const defaultContent = {
          ...chapter,
          contentHTML: "Chapter lỗi, vui lòng thử lại sau",
        };

        await fs.writeFile(
          filePath,
          JSON.stringify(defaultContent, null, 2),
          "utf-8"
        );

        console.log(`Created default content for missing chapter: ${chapter.slug}`);
      }
    }
    
    console.log('errChapters', errChapters)
  } catch (error) {
    console.error("Error in createDefaultContentForMissingChapters:", error);
  }
}

// Step1 crawl all chapters
// crawlChapters();

// Step 2: crawl content of each chapter
// crawlChapterContent();

// Step 3: Find the chapter that has no exits in folder, create a default content: "Chapter lỗi, vui lòng thử lại sau"
createDefaultContentForMissingChapters()
