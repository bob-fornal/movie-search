import { Injectable, signal } from '@angular/core';

import { environment } from '../../../environments/environment.development';

import { Genre } from '../interfaces/genre';
import { Token } from '../interfaces/token';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceRest {
  private API_ENDPOINT: string = environment.API_ENDPOINT;
  private bearerToken: string = '';

  readonly EMPTY_GENRE: Genre = {
    data: [],
    totalPages: 1,
    pages: [],
  };
  private genreLimit: number = 10;
  private _sharedGenre = signal<Genre>({ ...this.EMPTY_GENRE });
  readonly sharedGenre = this._sharedGenre.asReadonly();

  private async setBearerToken(): Promise<void> {
    const path: string = `${this.API_ENDPOINT}/auth/token`;
    const result: any = await fetch(path);
    const json: Token = await result.json();
    this.bearerToken = json.token;
  }

  public async getGenres(page: number = 1): Promise<any> {
    if (this.bearerToken === '') await this.setBearerToken();
    const currentData: Genre = { ...this.sharedGenre() };
    if (page > currentData.totalPages) return;

    let genres: Genre = { ...this.EMPTY_GENRE };
    try {
      const path: string = `${this.API_ENDPOINT}/genres/movies?limit=${this.genreLimit}&page=${page}`;
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
    }

    if (!currentData.pages.includes(page)) {
      currentData.data.push(...genres.data);
      currentData.pages.push(page);
      currentData.totalPages = genres.totalPages;
    }

    this._sharedGenre.set({ ...currentData });
  }
}
