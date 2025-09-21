import { inject, Injectable, signal } from '@angular/core';

import { Genre, GenreItem } from '../interfaces/genre';
import { Token } from '../interfaces/token';
import { MovieDetail, MovieItem, Movies, MovieTitles } from '../interfaces/movies';
import { SpinnerService } from './spinner-service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceRest {
  private spinnerService: SpinnerService = inject(SpinnerService);

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

  readonly EMPTY_MOVIE_TITLES: MovieTitles = {
    data: [],
    totalPages: 1,
    page: 1,
  }
  private movieTitleLimit: number = 50;
  private _sharedTitles = signal<MovieTitles>({ ...this.EMPTY_MOVIE_TITLES });
  readonly sharedTitles = this._sharedTitles.asReadonly();
  private _filteredTitles = signal<MovieTitles>({ ...this.EMPTY_MOVIE_TITLES });
  readonly filteredTitles = this._filteredTitles.asReadonly();

  private async setBearerToken(): Promise<void> {
    this.spinnerService.show();
    const path: string = `${this.API_ENDPOINT}/auth/token`;
    const result: any = await fetch(path);
    const json: Token = await result.json();
    this.bearerToken = json.token;
    this.spinnerService.hide();
  }

  public async getGenres(page: number = 1): Promise<void> {
    this.spinnerService.show();
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
      const items = await result.json()
      items.data = this.adjustGenre(items.data);
      genres = items;
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
    this.spinnerService.hide();
  }

  public async getMovieTitles() {
    this.spinnerService.show();
    if (this.bearerToken === '') await this.setBearerToken();

    let titles: MovieTitles = { ...this.EMPTY_MOVIES };
    try {
      let page: number = 1;
      do {
        const path: string = `${this.API_ENDPOINT}/movies/titles?page=${page}&limit=${this.movieTitleLimit}`;
        const result: any = await fetch(path, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.bearerToken}`,
          },
        });
        const items: any = await result.json();
        titles.page = page;
        titles.totalPages = items.totalPages;
        titles.data.push(...items.data);
        page = page + 1;
      } while (page < titles.totalPages);
    } catch (error) {
      console.log(error);
      this._filteredTitles.set({ ...this.EMPTY_MOVIE_TITLES });
      this._sharedTitles.set({ ...this.EMPTY_MOVIE_TITLES });
      return;
    }

    this._filteredTitles.set({ ...titles });
    this._sharedTitles.set({ ...titles });
    this.spinnerService.hide();
  }

  public async getMovies(search = '', genre = '', page: number = 1): Promise<void> {
    this.spinnerService.show();
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
    this.spinnerService.hide();
  }

  public async findMovieGroup(id: string): Promise<void> {
    this.spinnerService.show();
    if (this.bearerToken === '') await this.setBearerToken();

    let movies: Movies = { ...this.EMPTY_MOVIES };
    try {
      let page: number = 1;
      let totalPages: number = 1;
      let titleFound: boolean = false;
      do {
        const path: string = `${this.API_ENDPOINT}/movies?page=${page}&limit=${this.moviesLimit}`;
        const result: any = await fetch(path, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.bearerToken}`,
          },
        });
        const items: any = await result.json();
        totalPages = items.totalPages;
        for (let i = 0, len = items.data.length; i < len; i++) {
          if (items.data[i].id === id) {
            titleFound = true;
            break;
          }
        }
        if (titleFound === true) {
          const adjustedMovies = this.adjustMovies(items.data);
          movies = { ...items, data: adjustedMovies, page }; 
        } else {
          page = page + 1;
        }
        console.log('---', page, totalPages, titleFound, page < totalPages || titleFound === false);
      } while (page < totalPages && titleFound === false);
    } catch (error) {
      console.log(error);
      this._sharedMovies.set({ ...this.EMPTY_MOVIES })
      return;
    }
    
    this._sharedMovies.set({ ...movies });
    this.spinnerService.hide();
  }

  public async getIndividualMovieData(id: string): Promise<any> {
    this.spinnerService.show();
    try {
      const path: string = `${this.API_ENDPOINT}/movies/${id}`;
      const result: any = await fetch(path, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
        },
      });
      const movie: MovieDetail = await result.json();
      this.spinnerService.hide();
      return movie;
    } catch (error) {
      console.log(error);
      this.spinnerService.hide();
      return null;
    }
  }

  // internal functionality

  private adjustMovies(movies: Array<MovieItem>): Array<MovieItem> {
    const adjusted: Array<MovieItem> = [...movies];
    adjusted.forEach((movie: MovieItem) => {
      if (!movie.hasOwnProperty('posterUrl')) {
        movie.posterUrl = '/default_poster.webp';
      }
    });
    return adjusted;
  }


  private adjustGenre(data: Array<GenreItem>): Array<GenreItem> {
    const unduplicated = [...new Set(data)];
    return unduplicated.filter(item => item !== null && item !== undefined);
  }


  private isObjectNotEmpty(object: any): boolean {
  if (typeof object !== 'object' || object === null) return false;
  return Object.keys(object).length > 0;
}
}
