import { MovieId } from "./movie";

export interface GenreItem {
  id: string;
  movies: Array<MovieId>;
  title: string;
}
export interface Genre {
  data: Array<GenreItem>;
  totalPages: number;
  pages: Array<number>;
}
