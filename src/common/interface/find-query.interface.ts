import { Paging } from './pagination.interface';

export interface FindAllQueryInterface<T> {
  rows: T[],
  paging?: Paging
}

export class CountQueryResponse {
  count: number
}
