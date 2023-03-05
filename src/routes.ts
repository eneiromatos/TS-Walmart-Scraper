import { createCheerioRouter, log } from "crawlee";
import { exportItem } from "./itemExporters.js";
import { Labels } from "./labels.js";
import {
  getTotalPages,
  navigateAllPages,
  navigatePageRange,
  navigateToItemUrls,
} from "./listingNavigation.js";
import { isBlocked } from "./validations.js";

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ request }) => {
  log.error("Can't handle request, skipping", {
    label: request.label,
    url: request.url,
  });
});

router.addHandler(Labels.Listing, async ({ request, $ }) => {
  log.info("Handling", { label: request.label, url: request.url });

  if (isBlocked(request.loadedUrl!)) throw new Error("Request blocked.");

  const listingData = JSON.parse($("#__NEXT_DATA__").html()!);

  const pricing = request.userData.pricing;
  if (pricing.maxPrice < pricing.minPrice) {
    log.error(`Maximum Price should be greater or equal to Minimum Price.`);
    return;
  }

  const pagination = request.userData.pagination;
  if (pagination) {
    const startPage = pagination.startPageNumber;
    const finalPage = pagination.finalPageNumber;
    const triggerAllPages = startPage === 0 && finalPage === 0;
    const totalPages = getTotalPages(listingData);

    if (startPage > finalPage) {
      log.error("Start Page should be lesser or equal to Final Page");
      return;
    }

    if (finalPage > totalPages) {
      log.error(
        `Final Page should be less or equal to the total number of pages of this category: ${totalPages} pages`
      );
      return;
    }

    if (triggerAllPages) {
      await navigateAllPages(request.url, listingData, pricing);
    } else {
      await navigatePageRange(request.url, startPage, finalPage, pricing);
    }
  } else {
    await navigateToItemUrls(listingData, pricing);
  }
});

router.addHandler(Labels.Detail, async ({ request, $ }) => {
  log.info("Handling", { label: request.label, url: request.url });

  if (isBlocked(request.loadedUrl!)) throw new Error("Request blocked.");

  const itemData = JSON.parse($("#__NEXT_DATA__").html()!);
  const pricing = request.userData.pricing;

  await exportItem(request.url, itemData, pricing);
});
