export type PaginationResponse<T> = {
  data: T[];
  currentPage: number;
  recordsPerPage: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
};

type PaginationParams<T> = {
  data: T[];
  page: number;
  limit: number;
  totalRecords: number;
};

export function paginationFormatter<T>({
  data,
  page,
  limit,
  totalRecords,
}: PaginationParams<T>): PaginationResponse<T> {
  const totalPages = Math.ceil(totalRecords / limit);
  const hasNextPage = page < totalPages;

  return {
    data,
    currentPage: page,
    recordsPerPage: limit,
    totalRecords,
    totalPages,
    hasNextPage,
  };
}
