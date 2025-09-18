import { Injectable, signal } from '@angular/core';

import { environment } from '../../../environments/environment.development';

import { Genre } from '../interfaces/genre';
import { Token } from '../interfaces/token';
import { MovieDetail, MovieItem, Movies } from '../interfaces/movies';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceRest {
  private API_ENDPOINT: string = 'https://0kadddxyh3.execute-api.us-east-1.amazonaws.com'; // environment.API_ENDPOINT;
  private bearerToken: string = '';

  readonly EMPTY_GENRE: Genre = {
    data: [],
    totalPages: 1,
    pages: [],
  };
  private genreLimit: number = 10;
  private _sharedGenre = signal<Genre>({ ...this.EMPTY_GENRE });
  readonly sharedGenre = this._sharedGenre.asReadonly();

  readonly EMPTY_MOVIES: Movies = {
    data: [],
    totalPages: 1,
    page: 1,
  };
  private moviesLimit: number = 50;
  private _sharedMovies = signal<Movies>({ ...this.EMPTY_MOVIES });
  readonly sharedMovies = this._sharedMovies.asReadonly();

  private async setBearerToken(): Promise<void> {
    const path: string = `${this.API_ENDPOINT}/auth/token`;
    const result: any = await fetch(path);
    const json: Token = await result.json();
    this.bearerToken = json.token;
  }

  public async getGenres(page: number = 1): Promise<void> {
    if (this.bearerToken === '') await this.setBearerToken();
    const currentData: Genre = { ...this.sharedGenre() };
    if (page > currentData.totalPages) return;

    let genres: Genre = { ...this.EMPTY_GENRE };
    try {
      const path: string = `${this.API_ENDPOINT}/genres/movies?page=${page}&limit=${this.genreLimit}`;
      const result: any = await fetch(path, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
        },
      });
      genres = await result.json();
    } catch (error) {
      console.log(error);
      this._sharedGenre.set({ ...this.EMPTY_GENRE });
      return;
    }

    if (!currentData.pages.includes(page)) {
      currentData.data.push(...genres.data);
      currentData.pages.push(page);
      currentData.totalPages = genres.totalPages;
    }

    this._sharedGenre.set({ ...currentData });
  }

  public async getMovies(search = '', genre = '', page: number = 1): Promise<void> {
    if (this.bearerToken === '') await this.setBearerToken();

    let movies: Movies = { ...this.EMPTY_MOVIES };
    try {
      const path: string = `${this.API_ENDPOINT}/movies?page=${page}&limit=${this.moviesLimit}&search=${search}&genre=${genre}`;
      const result: any = await fetch(path, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
        },
      });
      const items: any = await result.json();
      const adjustedMovies = this.adjustMovies(items.data);
      movies = { ...items, data: adjustedMovies, page };
    } catch (error) {
      console.log(error);
      this._sharedMovies.set({ ...this.EMPTY_MOVIES })
      return;
    }
    
    this._sharedMovies.set({ ...movies });
  }

  public async getIndividualMovieData(id: string): Promise<any> {
    try {
      const path: string = `${this.API_ENDPOINT}/movies/${id}`;
      const result: any = await fetch(path, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
        },
      });
      const movie: MovieDetail = await result.json();
      return movie;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private adjustMovies(movies: Array<MovieItem>): Array<MovieItem> {
    const adjusted: Array<MovieItem> = [...movies];
    adjusted.forEach((movie: MovieItem) => {
      if (!movie.hasOwnProperty('posterUrl')) {
        movie.posterUrl = '/default_poster.webp';
      }
    });
    return adjusted;
  }
}
