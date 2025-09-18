export interface MovieItem {
  id: string;
  title: string;
  posterUrl?: string;
  rating?: string;
}

export interface Movies {
  data: Array<MovieItem>;
  totalPages: number;
};
