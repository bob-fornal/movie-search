import { Component, effect, inject } from '@angular/core';

import { ApiServiceRest } from '../../core/services/api-service-rest';
import { Genre, GenreItem } from '../../core/interfaces/genre';
import { MovieItem, Movies } from '../../core/interfaces/movies';

@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage {
  private useRest: boolean = true;
  private apiServiceRest: ApiServiceRest = inject(ApiServiceRest);

  private activeService = this.useRest ? this.apiServiceRest : this.apiServiceRest;

  public genre: Genre = this.activeService.EMPTY_GENRE;
  public selectedGenre: GenreItem | null = null;

  public movies: Movies = this.activeService.EMPTY_MOVIES;
  public selectedMovie: MovieItem | null = null;
  
  constructor() {
    effect(this.handleGenreChange.bind(this));
    effect(this.handleMovieChange.bind(this));
    this.init();
  }

  private async init() {
    await this.activeService.getGenres();
    await this.activeService.getMovies();
  }

  private handleGenreChange(): void {
    this.genre = this.activeService.sharedGenre();
    console.log(this.genre);
  }

  private handleMovieChange(): void {
    this.movies = this.activeService.sharedMovies();
    console.log(this.movies);
    if (this.movies.data.length > 0) {
      this.selectMovie(this.movies.data[0]);
    }
  }

  isSelected(item: GenreItem): boolean {
    if (this.selectedGenre === null) return false;
    return this.selectedGenre?.id === item.id
  }

  isDisabled(item: GenreItem): boolean {
    if (this.selectedGenre === null) return false;
    return this.selectedGenre?.id !== item.id
  }

  toggleFilterItem(item: GenreItem): void {
    if (this.selectedGenre !== null) return;
    this.selectedGenre = item;
  }

  clearFilterItem(): void {
    this.selectedGenre = null;
  }

  loadMoreGenre(): void {
    const nextPage: number = this.genre.pages.length + 1;
    this.activeService.getGenres(nextPage);
  }

  getMovieAvatar(movie: MovieItem): string {
    if (movie.hasOwnProperty('posterUrl')) return movie.posterUrl!;
    return '/default_poster.webp';
  }

  async selectMovie(movie: MovieItem): Promise<void> {
    this.selectedMovie = movie;
    const additional = await this.activeService.getIndividualMovieData(movie.id);
    console.log(additional);
  }
}
