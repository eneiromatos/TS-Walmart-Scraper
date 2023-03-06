interface IIdCodes {
  SKU?: string;
  UPC?: string;
}

interface ISeller {
  brand?: string;
  brandURL?: string;
  seller?: string;
  sellerURL?: string;
}

interface IMedia {
  main?: string;
  gallery?: string[];
  videos?: { title?: string; url: string }[];
}

interface IPricing {
  salePrice: number;
  fullPrice?: number;
  currencySymbol?: string;
}

interface IAtribute {
  attribute: string;
  value: string;
}

interface ICategory {
  fullPath?: string;
  pathParts?: { name: string; url?: string }[];
}

interface IOrderLimit {
  min?: number;
  max?: number;
}

interface IInformational {
  shortDescription?: string;
  longDescription?: string;
  specifications?: IAtribute[];
}

interface IVariant {
  isCurrentVariant: boolean;
  url: string;
  SKU?: string;
  isAvailable: boolean;
  pricing: IPricing;
  options: IAtribute[];
}

interface IRating {
  itemReviews?: number;
  itemRating?: number;
  sellerReviews?: number;
  sellerRating?: number;
}

class ItemModel {
  URL: string;
  idCodes: IIdCodes;
  seller: ISeller;
  title: string;
  media: IMedia;
  pricing: IPricing;
  isAvailable: boolean;
  isGiftEligible: boolean;
  isUsed: boolean;
  rating: IRating;
  orderLimits: IOrderLimit;
  category: ICategory;
  info: IInformational;
  variants: IVariant[];

  constructor() {
    this.URL = "";
    this.idCodes = {};
    this.seller = {};
    this.title = "";
    this.media = {};
    this.pricing = { salePrice: 0 };
    this.isAvailable = false;
    this.isGiftEligible = false;
    this.isUsed = false;
    this.rating = {};
    this.orderLimits = {};
    this.category = {};
    this.info = {};
    this.variants = [];
  }
}

export {
  ItemModel,
  IIdCodes,
  ISeller,
  IMedia,
  IPricing,
  IAtribute,
  ICategory,
  IOrderLimit,
  IInformational,
  IVariant,
  IRating,
};
