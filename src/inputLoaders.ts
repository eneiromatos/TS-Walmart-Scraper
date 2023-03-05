import { RequestQueue } from "crawlee";
import { getRequest } from "./requestGenerator.js";
import { Labels } from "./labels.js";

async function loadInputUrls(
  urls: string[],
  pagination?: { startPageNumber: number; finalPageNumber: number },
  pricing?: { minPrice: number; maxPrice: number },
  label?: Labels
) {
  const requestQueue = await RequestQueue.open();

  for (let url of urls) {
    const request = getRequest(url, pagination, pricing, label);
    await requestQueue.addRequest(request);
  }
}

async function loadInputKeywords(
  keywords: string[],
  pagination: { startPageNumber: number; finalPageNumber: number },
  pricing: { minPrice: number; maxPrice: number },
  label?: Labels
) {
  const requestQueue = await RequestQueue.open();

  const newUrl = new URL("https://www.walmart.com/search");

  for (const keyword of keywords) {
    newUrl.searchParams.set("q", keyword);
    const request = getRequest(newUrl.href, pagination, pricing, label);
    await requestQueue.addRequest(request);
  }
}

export { loadInputKeywords, loadInputUrls };
