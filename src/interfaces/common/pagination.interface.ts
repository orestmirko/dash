export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    pages: number;
    currentPage: number;
    itemsPerPage: number;
  };
} 