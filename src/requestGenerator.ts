import { Labels } from "./labels.js";
import { RequestOptions } from "crawlee";

function getRequest(
  url: string,
  pagination?: { startPageNumber: number; finalPageNumber: number },
  pricing?: { minPrice: number; maxPrice: number },
  label?: Labels
) {
  const finalRequest: RequestOptions = {
    url,
    label,
    userData: { pagination, pricing },
  };

  const isProduct = url.includes("/ip/");
  const isCategory = url.includes("/browse/");
  const isBrand = url.includes("/brand/");
  const isKeyword = url.includes("search?q=");

  /*****************************************************************/

  if (isProduct) {
    finalRequest.label = Labels.Detail;
  } else if (isCategory || isKeyword || isBrand) {
    finalRequest.label = Labels.Listing;
  }

  return finalRequest;
}

export { getRequest };
