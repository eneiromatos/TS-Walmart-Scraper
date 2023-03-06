
# TS-Walmart-Scraper

TS-Walmart-Scraper is a web scraping tool developed in TypeScript on top of the Crawlee library. It allows users to extract relevant data points from products on walmart.com. The scraper can be used with inputs such as category URLs, brand URLs, search keywords or specific product URLs.

## Installation

**Clone the repository**

 `git clone https://github.com/<username>/TS-Walmart-Scraper.git`
 `cd TS-Walmart-Scraper`

**Install dependencies**

`npm install`

## Usage

The input for the scraper is a JSON file named `INPUT.json`, which should be located in the following directory: `project_folder\storage\key_value_stores\default\`. The `INPUT.json` file should contain the following fields:

-   `productUrls`: An array of URLs for specific product pages to scrape.
-   `listingUrls`: An array of URLs for category pages or brand pages to scrape (that contains listing of products and pagination).
-   `keywords`: An array of search keywords to use when searching Walmart.com.
-   `maxPrice`: The maximum price for products to scrape.
-   `minPrice`: The minimum price for products to scrape.
-   `startPageNumber`: The page number to start scraping from.
-   `finalPageNumber`: The final page number to scrape.

Using `0` as value for `minPrice` and `maxPrice` indicates the scraper to collect products from all price ranges.

Using `0` as value for `startPageNumber` and `finalPageNumber` indicates the scraper to crawl all the page range.

To run the scraper, navigate to the project directory in your terminal and run the following command:
`npm start` 


## Output
The output of the scraper will be a series of JSON files, one per product scraped, and will be located in the following directory: `project_folder\storage\datasets\default`.

The output JSON files from TS-Walmart-Scraper includes all the following fields:
-   `URL`: The URL of the product page.
-   `idCodes`: An object containing the unique identifier codes of the product, including the `SKU` and `UPC`.
-   `seller`: An object containing information about the seller and brand of the product, including the `brand`, `brandURL`, `seller`, and `sellerURL`.
-   `title`: The title of the product.
-   `media`: An object containing URLs for images and videos of the product, including the `main` image URL, `gallery` array of image URLs, and `videos` array of video objects, each with a `title` and `url` field.
-   `pricing`: An object containing pricing information for the product, including the `salePrice`, `fullPrice`, and `currencySymbol`.
-   `isAvailable`: A boolean indicating whether the product is currently available.
-   `isGiftEligible`: A boolean indicating whether the product is eligible for gift-giving.
-   `isUsed`: A boolean indicating whether the product is used.
-   `rating`: An object containing rating information for the product and seller, including the `itemRating`, `itemReviews`, `sellerRating`, and `sellerReviews`.
-   `orderLimits`: An object containing minimum and maximum order limits for the product, including the `min` and `max` fields.
-   `category`: An object containing information about the category of the product, including the `fullPath` and `pathParts` array of category objects, each with a `name` and `url` field.
-   `info`: An object containing additional information about the product, including the `shortDescription`, `longDescription`, and `specifications` array of objects, each with an `attribute` and `value` field.
-   `variants`: An array containing information about different variants of the product, including objects with a `isCurrentVariant`, `url`, `SKU`, `isAvailable`, `pricing`, and `options` field. The `options` field contains an array of objects, each with an `attribute` and `value` field.

## License

This project is licensed under the AGPL-3.0 license License. See the [LICENSE](https://github.com/eneiromatos/TS-email-scraper/blob/develop/LICENSE.md) file for details.

## Final words

I hope you find this software useful and I would be honored if you fork this repository and collaborate with me to improve it. If you have any suggestions or find any bugs, please don't hesitate to open an issue or submit a pull request. Thanks for using TS-Walmart-Scraper!
