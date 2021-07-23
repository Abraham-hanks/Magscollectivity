import { DOCUMENT_REPOSITORY } from "./constants";
import { DocumentModel } from "./document.model";

export const DocumentProvider = [
  {
    provide: DOCUMENT_REPOSITORY,
    useValue: DocumentModel,
  }
]