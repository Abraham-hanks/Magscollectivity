import { PAYMENT_PLAN_REPOSITORY, PRODUCT_REPOSITORY } from "./constants";
import { PaymentPlanModel } from "./models/payment-plan.model";
import { ProductModel } from "./models/product.model";

export const ProductProvider = [
  {
    provide: PRODUCT_REPOSITORY,
    useValue: ProductModel,
  },
  {
    provide: PAYMENT_PLAN_REPOSITORY,
    useValue: PaymentPlanModel,
  }
];
