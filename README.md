# goodreads-quotes

Easily scrape quotes from the goodreads.com site by tags, author or book.

### Installing

```
npm i goodreads-quotes
```

## Basic Usage

```javascript
const goodreadsQuotes = require("goodreads-quotes");

// Takes in an array of compatible URLs. See Compatible URLs below.
goodreadsQuotes.scrapeURLs(["https://www.goodreads.com/author/quotes/4918776.Seneca"]);
```
Saves to file ```output/4918776.Seneca.json``` JSON array in the form of:
```
[
  {
      "author": "Lucius Annaeus Seneca",
      "quote": [
        "Sometimes even to live is an act of courage."
      ],
      "book": "",
      "likes": 2212,
      "tags": [
        "perseverance",
        "suicide",
        "survival"
      ]
    },
    ... 1666 and more
]
```
If a file of a URL exists it will not be scraped again.

## Compatible URLs

Links should ideally not have ```?page=number``` at the end and should follow types below:

https://www.goodreads.com/author/quotes/1244.Mark_Twain (Author)
https://www.goodreads.com/work/quotes/3204327-the-fellowship-of-the-ring (Book)
https://www.goodreads.com/quotes/tag/strength (Tag)


## Built With

* [cheerio](https://github.com/cheeriojs/cheerio) - Fast, flexible, and lean implementation of core jQuery designed specifically for the server.
* [axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js

## Authors
Written by [mahsheikhdir](https://github.com/mahsheikhdir)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.
