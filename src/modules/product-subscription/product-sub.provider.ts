import { PRODUCT_SUB_REPOSITORY } from "./constants";
import { ProductSubModel } from "./product-sub.model";

export const ProductSubProvider = [
  {
    provide: PRODUCT_SUB_REPOSITORY,
    useValue: ProductSubModel,
  }
];
