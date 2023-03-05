import { RequestQueue } from "crawlee";
import { baseUrl } from "./main.js";
import { getRequest } from "./requestGenerator.js";

function getItemUrls(listingData: any): string[] {
  const itemElements =
    listingData.props.pageProps.initialData.searchResult.itemStacks[0].items;
  const itemUrls = itemElements
    .filter((el: { __typename: string }) => el.__typename === "Product")
    .map(
      (el: { canonicalUrl: string | URL }) =>
        new URL(el.canonicalUrl, baseUrl).href
    );

  return itemUrls;
}

async function navigateToItemUrls(
  listingData: any,
  pricing: { minPrice: number; maxPrice: number }
): Promise<void> {
  const requestQueue = await RequestQueue.open();
  const itemUrls = getItemUrls(listingData);

  for (const url of itemUrls) {
    const request = getRequest(url);
    Object.assign(request.userData!, { pricing });
    await requestQueue.addRequest(request);
  }
}

function getTotalPages(listingData: any): number {
  const totalPages =
    listingData.props.pageProps.initialData.searchResult.paginationV2.maxPage;

  return totalPages;
}

function generatePageRange(
  currentUrl: string,
  startPage: number,
  finalPage: number
): string[] {
  const navigationUrlList = [];
  const navigationUrl = new URL(currentUrl);
  for (let pageNum = startPage; pageNum <= finalPage; pageNum++) {
    navigationUrl.searchParams.set("page", pageNum.toString());
    navigationUrlList.push(navigationUrl.href);
  }

  return navigationUrlList;
}

async function navigatePageRange(
  currentUrl: string,
  startPage: number,
  finalPage: number,
  pricing: { minPrice: number; maxPrice: number }
): Promise<void> {
  const requestQueue = await RequestQueue.open();
  const navigationUrlList = generatePageRange(currentUrl, startPage, finalPage);

  for (const url of navigationUrlList) {
    const request = getRequest(url);
    Object.assign(request.userData!, { pricing });
    await requestQueue.addRequest(request);
  }
}

async function navigateAllPages(
  currentUrl: string,
  listingData: any,
  pricing: { minPrice: number; maxPrice: number }
): Promise<void> {
  const totalPages = getTotalPages(listingData);
  await navigatePageRange(currentUrl, 1, totalPages, pricing);
}

export {
  navigateAllPages,
  navigatePageRange,
  navigateToItemUrls,
  getTotalPages,
};
