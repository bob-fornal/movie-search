import { Injectable, signal } from '@angular/core';

import { environment } from '../../../environments/environment.development';

import { Genre } from '../interfaces/genre';
import { Token } from '../interfaces/token';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_ENDPOINT: string = environment.API_ENDPOINT;
  private bearerToken: string = '';

  readonly EMPTY_GENRE: Genre = {
    data: [],
    totalPages: 1,
    page: 1,
  };
  private genreLimit: number = 25;
  private _sharedGenre = signal<Genre>({ ...this.EMPTY_GENRE });
  readonly sharedGenre = this._sharedGenre.asReadonly();

  private async setBearerToken(): Promise<void> {
    const path: string = `${this.API_ENDPOINT}/auth/token`;
    const result: any = await fetch(path);
    const json: Token = await result.json();
    this.bearerToken = json.token;
    console.log(this.bearerToken);
  }

  public async getGenres(page: number = 1): Promise<any> {
    if (this.bearerToken === '') await this.setBearerToken();

    let data: Genre = { ...this.EMPTY_GENRE };
    try {
      const path: string = `${this.API_ENDPOINT}/genres/movies?limit=${this.genreLimit}&page=${page}`;
      const result: any = await fetch(path, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
        },
      });
      data = await result.json();
    } catch (error) {
      console.log(error);
      this._sharedGenre.set({ ...this.EMPTY_GENRE });
    }

    this._sharedGenre.set({
      ...data,
      page,
    });
  }
}
