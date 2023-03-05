import {
  CheerioCrawler,
  CheerioCrawlerOptions,
  log,
  RequestQueue,
  KeyValueStore,
  ProxyConfiguration,
} from "crawlee";
import { loadInputKeywords, loadInputUrls } from "./inputLoaders.js";
import { router } from "./routes.js";

interface InputSchema {
  productUrls: string[];
  listingUrls: string[];
  keywords: string[];
  startPageNumber: number;
  finalPageNumber: number;
  minPrice: number;
  maxPrice: number;
}

const {
  productUrls = [],
  listingUrls = [],
  keywords = [],
  startPageNumber = 0,
  finalPageNumber = 0,
  minPrice = 0,
  maxPrice = 0,
} = (await KeyValueStore.getInput<InputSchema>()) ?? {};

const baseUrl = "https://www.walmart.com/";

const pricing = { minPrice, maxPrice };
const pagination = { startPageNumber, finalPageNumber };

const requestQueue = await RequestQueue.open();

const crawlerOptions: CheerioCrawlerOptions = {
  requestQueue,
  maxConcurrency: 100,
  maxRequestRetries: 5,
  navigationTimeoutSecs: 90,
  requestHandlerTimeoutSecs: 90,
  requestHandler: router,
};

await loadInputUrls(productUrls, undefined, pricing);

await loadInputUrls(listingUrls, pagination, pricing);

await loadInputKeywords(keywords, pagination, pricing);

const useProxy = false;
if (useProxy) {
  const proxyConfiguration = new ProxyConfiguration({ proxyUrls: [] });
  Object.assign(crawlerOptions, { proxyConfiguration });
}

const crawler = new CheerioCrawler(crawlerOptions);

log.info("Starting the crawl.");
await crawler.run();
log.info("Crawl finished.");

export { baseUrl };
