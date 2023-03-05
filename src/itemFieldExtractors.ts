import {
  IAtribute,
  ICategory,
  IIdCodes,
  IInformational,
  IMedia,
  IOrderLimit,
  IPricing,
  IRating,
  ISeller,
  IVariant,
} from "./itemModel.js";
import { baseUrl } from "./main.js";

function getSeller(itemData: any): ISeller {
  const product = itemData.props.pageProps.initialData.data.product;

  let brand = product.brand;
  let brandURL = new URL(product.brandUrl, baseUrl).href;
  let seller = product.sellerDisplayName;
  let sellerID =
    itemData.props.pageProps.initialData.data.product.catalogSellerId;
  let sellerURL = `https://www.walmart.com/seller/${sellerID}`;

  return {
    brand,
    brandURL,
    seller,
    sellerURL,
  };
}

function getCodes(itemData: any): IIdCodes {
  let SKU: string | undefined;
  let UPC: string | undefined;

  try {
    SKU = itemData.props.pageProps.initialData.data.product.usItemId;
    SKU = SKU ? SKU : undefined;
  } catch (error) {
    null;
  }

  try {
    UPC = itemData.props.pageProps.initialData.data.product.upc;
    UPC = UPC ? UPC : undefined;
  } catch (error) {
    null;
  }

  return { SKU, UPC };
}

function getPrices(itemData: any): IPricing {
  const priceInfo = itemData.props.pageProps.initialData.data.product.priceInfo;

  let fullPrice: number | undefined;

  const salePrice = priceInfo.currentPrice.price;
  const currencySymbol = priceInfo.currentPrice.currencyUnit;

  if (priceInfo.wasPrice) {
    fullPrice = priceInfo.wasPrice.price;
  }

  return {
    salePrice,
    fullPrice,
    currencySymbol,
  };
}

function getTitle(itemData: any): string {
  const title = itemData.props.pageProps.initialData.data.product.name;
  return title;
}

function getMedia(itemData: any): IMedia {
  const images =
    itemData.props.pageProps.initialData.data.product.imageInfo.allImages;

  let gallery: string[] = images.map((el: { url: string }) => el.url.trim());
  let main = gallery.shift();

  let videos = undefined;

  const videoElements = itemData.props.pageProps.initialData.data.idml.videos;
  if (videoElements) {
    videos = videoElements.map(
      (el: { title: string; versions: { large: string } }) => {
        return {
          title: el.title ? el.title : undefined,
          url: el.versions.large,
        };
      }
    );
  }

  return { main, gallery, videos };
}

function getAvailability(itemData: any): boolean {
  const isAvailable =
    itemData.props.pageProps.initialData.data.product.availabilityStatus ===
    "IN_STOCK";
  return isAvailable;
}

function getIsGiftEligible(itemData: any): boolean {
  const isGiftEligible =
    itemData.props.pageProps.initialData.data.product.giftingEligibility;
  return isGiftEligible;
}

function getIsUsed(itemData: any): boolean {
  const isUsed =
    itemData.props.pageProps.initialData.data.product.conditionType === "Used";
  return isUsed;
}

function getRatings(itemData: any): IRating {
  let itemRating =
    itemData.props.pageProps.initialData.data.reviews
      .roundedAverageOverallRating;
  itemRating = itemRating ? itemRating : undefined;

  let itemReviews =
    itemData.props.pageProps.initialData.data.reviews.totalReviewCount;
  itemReviews = itemReviews ? itemReviews : undefined;

  let sellerRating: number | undefined =
    itemData.props.pageProps.initialData.data.product.sellerAverageRating;
  sellerRating = sellerRating ? Number(sellerRating.toFixed(1)) : undefined;

  let sellerReviews =
    itemData.props.pageProps.initialData.data.product.sellerReviewCount;
  sellerReviews = sellerReviews ? sellerReviews : undefined;

  return { itemRating, itemReviews, sellerRating, sellerReviews };
}

function getOrderLimits(itemData: any): IOrderLimit {
  const maxOrder = itemData.props.pageProps.initialData.data.product.orderLimit;
  const minOrder =
    itemData.props.pageProps.initialData.data.product.orderMinLimit;

  return {
    min: minOrder,
    max: maxOrder,
  };
}

function getCategory(itemData: any): ICategory {
  const pathParts =
    itemData.props.pageProps.initialData.data.product.category.path.map(
      (el: { name: any; url: string | URL }) => {
        return {
          name: el.name,
          url: new URL(el.url, baseUrl),
        };
      }
    );
  const fullPath = pathParts.map((el: { name: any }) => el.name).join(" > ");
  return { fullPath, pathParts };
}

function getInfoDetail(itemData: any): IInformational {
  let shortDescription =
    itemData.props.pageProps.initialData.data.idml.shortDescription;
  shortDescription = shortDescription ? shortDescription : undefined;

  let longDescription =
    itemData.props.pageProps.initialData.data.idml.longDescription;
  longDescription = longDescription ? longDescription : undefined;

  let specifications = undefined;

  try {
    specifications =
      itemData.props.pageProps.initialData.data.idml.specifications.map(
        (el: { name: any; value: any }) => {
          return { attribute: el.name, value: el.value };
        }
      );
  } catch (error) {
    null;
  }

  return { shortDescription, longDescription, specifications };
}

function getVariants(itemData: any): IVariant[] {
  const product = itemData.props.pageProps.initialData.data.product;
  const variantList: IVariant[] = [];

  if (!product.variantCriteria.length) {
    return variantList;
  }

  for (const key in product.variantsMap) {
    const variant = product.variantsMap[key];
    const url = new URL(variant.productUrl, baseUrl).href;
    const SKU = variant.usItemId;
    const isAvailable = variant.availabilityStatus === "IN_STOCK";
    const pricing: IPricing = {
      salePrice: variant.priceInfo.currentPrice.price,
      currencySymbol: variant.priceInfo.currentPrice.currencyUnit,
    };
    const options: IAtribute[] = variant.variants.map(
      (optionName: string | any[]) => {
        const productVariant = product.variantCriteria.find((el: { id: any }) =>
          optionName.includes(el.id)
        );
        const variantValue = productVariant.variantList.find(
          (value: { id: any }) => value.id === optionName
        );

        const attribute = productVariant.name;
        const value = variantValue.name;

        return { attribute, value };
      }
    );

    variantList.push({
      url,
      SKU,
      isAvailable,
      pricing,
      options,
    });
  }

  return variantList;
}

export {
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
};
