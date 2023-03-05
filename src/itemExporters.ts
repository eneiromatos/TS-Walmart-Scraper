import { Dataset, log } from "crawlee";
import { ItemModel } from "./itemModel.js";
import {
  getPrices,
  getCodes,
  getSeller,
  getTitle,
  getMedia,
  getAvailability,
  getIsGiftEligible,
  getIsUsed,
  getRatings,
  getOrderLimits,
  getCategory,
  getInfoDetail,
  getVariants,
} from "./itemFieldExtractors.js";

async function exportItem(
  currentUrl: string,
  itemData: any,
  pricing: { minPrice: number; maxPrice: number }
): Promise<void> {
  const prices = getPrices(itemData);
  const price = prices.fullPrice!;
  const isInRange = price >= pricing.minPrice && price <= pricing.maxPrice;
  const isAllPriceRange = pricing.maxPrice === 0 && pricing.minPrice === 0;

  if (pricing.maxPrice < pricing.minPrice) {
    log.error(`Maximum Price should be greater or equal to Minimum Price.`);
    return;
  }

  if (!isInRange && !isAllPriceRange) {
    log.info(`Product out of price range skipping.`);
    return;
  }

  const item = new ItemModel();
  item.URL = currentUrl;
  item.pricing = prices;
  item.idCodes = getCodes(itemData);
  item.seller = getSeller(itemData);
  item.title = getTitle(itemData);
  item.media = getMedia(itemData);
  item.isAvailable = getAvailability(itemData);
  item.isGiftEligible = getIsGiftEligible(itemData);
  item.isUsed = getIsUsed(itemData);
  item.rating = getRatings(itemData);
  item.orderLimits = getOrderLimits(itemData);
  item.category = getCategory(itemData);
  item.info = getInfoDetail(itemData);
  item.variants = getVariants(itemData);

  await Dataset.pushData(item);
}

export { exportItem };
