const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const loadSite = async (url, pagination = 0) => {
  if (pagination > 0) {
    const pages = [];
    for (let i = 0; i < pagination; i++) {
      const pageURL = url + "?page=" + (i + 1);
      const result = await axios(pageURL);
      pages.push(cheerio.load(result.data));
      console.log("Added page: " + pageURL);
    }
    return pages;
  } else {
    const result = await axios(url);
    return [cheerio.load(result.data)];
  }
};

const scrapeSite = async (url) => {
  const pages = await loadSite(url, 10);

  const quotes = [];
  for (page in pages) {
    const $ = pages[page];
    $(".quoteText").map(function (i, el) {
      let [quote] = $(this)
        .text()
        .match(/(?<=\“)(.*?)(?=\”)/g);
      quotes.push(quote);
    });
    console.log("Scraped page: " + page + " of " + pages.length);
  }

  const name = url.match(/([A-Z])\w+/g);
  return [name, quotes];
};

(async () => {
  const authorURLs = [
    "https://www.goodreads.com/author/quotes/4918776.Seneca",
  ];

  allQuotes = {};

  for (author in authorURLs) {
    const result = await scrapeSite(authorURLs[author]);
    allQuotes[result[0]] = result[1];
  }
  fs.writeFile("./output/quotes.json", JSON.stringify(allQuotes, null, "\t"), () => {
    console.log("Quotes retrieved and recorded!");
  });
})();
