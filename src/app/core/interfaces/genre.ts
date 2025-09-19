import { MovieId, MovieTitle } from "./movies";

export interface GenreDetail {
  id: string;
  title: string;
}

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
