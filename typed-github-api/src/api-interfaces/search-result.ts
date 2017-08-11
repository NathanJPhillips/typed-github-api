export interface SearchResult {
  score: number;
}

export interface SearchResults<T> {
  total_count: number;
  incomplete_results: boolean;
  items: Array<T & SearchResult>;
}
