import { CUSTOMER_REPOSITORY, REALTOR_TREE_REPOSITORY } from "./constants";
import { CustomerModel } from "./models/customer.model";
import { RealtorTreeModel } from "./models/realtor-tree.model";

export const CustomerProvider = [
  {
    provide: CUSTOMER_REPOSITORY,
    useValue: CustomerModel,
  },
  {
    provide: REALTOR_TREE_REPOSITORY,
    useValue: RealtorTreeModel,
  }
];
