import { GenreDetail } from "./genre";

export interface MovieId {
  id: string;
}

export interface MovieItem {
  id: string;
  title: string;
  posterUrl?: string;
  rating?: string;
}

export interface Movies {
  data: Array<MovieItem>;
  totalPages: number;
  page: number;
};

export interface MovieDetail {
  bestRating: number;
  datePublished: string;
  directors: Array<string>;
  duration: string;
  genres: Array<GenreDetail>;
  id: string;
  mainActors: Array<string>;
  ratingValue: 6.9;
  title: string;
  worstRating: number;
}

export interface MovieTitles {
  data: Array<MovieTitle>;
  totalPages: number;
  page: number;
};

export interface MovieTitle {
  id: string;
  title: string;
}
