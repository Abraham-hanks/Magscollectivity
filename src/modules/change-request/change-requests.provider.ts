import { ChangeRequestModel } from "./change-request.model";
import { CHANGE_REQUEST_REPOSITORY } from "./constants";

export const ChangeRequestProvider = [
  {
    provide: CHANGE_REQUEST_REPOSITORY,
    useValue: ChangeRequestModel,
  },
];