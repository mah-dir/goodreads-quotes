const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const loadSite = async (url) => {
  try {
    const result = await axios(url);
    return cheerio.load(result.data);
  } catch (error) {
    console.log("Problem loading the site...", error);
  }
};

const scrapeSite = async (url) => {
  try {
    // Load first page
    const startPage = await loadSite(url);
    // Grab the total number of pages

    let pages = 1;

    if (startPage(".next_page").length > 0) {
      pages = Number(startPage(".next_page").prev().text());
      console.log("There are " + pages + " pages for this URL: " + url);
    }
    // Scrape each page before going to the next

    const quoteArray = [];

    for (let i = 0; i < pages; i++) {
      let currentURL = url + "?page=" + (i + 1);
      console.log("Scraping ", currentURL);
      let $ = await loadSite(currentURL);

      $(".quoteDetails").each(function (i, el) {
        quoteArray.push({
          author: $(this)
            .find("span.authorOrTitle")
            .text()
            .trim()
            .replace(/,\s*$/, ""),
          quote: $(this)
            .find(".quoteText")
            .text()
            .match(/(?<=\“)(.*?)(?=\”)/g),
          book: $(this).find("a.authorOrTitle").text().trim(),
          likes: Number($(this).find(".right").text().trim().match(/\d+/g)),
          tags: $(this)
            .find(".left")
            .contents()
            .map(function (i, el) {
              let p = $(this).text().trim();
              if (i != 0 && p != "" && p != ",") {
                return $(this).text().trim();
              }
            })
            .get(),
        });
      });
    }

    return quoteArray;
  } catch (error) {
    console.log("Something went wrong...", error);
  }
};

(async () => {

  const URLs = [
    "https://www.goodreads.com/work/quotes/969064-the-essential-groucho-writings-by-and-for-groucho-marx",
    "https://www.goodreads.com/quotes/tag/animals"
  ];

  var dir = "./output";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  let allQuotes = [];

  for (u in URLs) {
    const fileName = URLs[u].split("/").pop() + ".json";

    if (fs.existsSync(dir + "/" + fileName)) {
      console.log('Already scraped. File name is : ' + fileName);
      continue;
    }

    const result = await scrapeSite(URLs[u]);
    allQuotes = result;

    fs.writeFile(
      "./output/" + fileName,
      JSON.stringify(allQuotes, null, "\t"),
      () => {
        console.log("Quotes retrieved and recorded! Can be found in file named: " + fileName);
      }
    );

  }
})();
