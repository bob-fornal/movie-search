import { Component, effect, inject } from '@angular/core';

import { ApiServiceRest } from '../../core/services/api-service-rest';
import { Genre, GenreDetail, GenreItem } from '../../core/interfaces/genre';
import { MovieDetail, MovieItem, Movies } from '../../core/interfaces/movies';

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
  public selectedMovieAdditionalDetail: MovieDetail | null = null;
  
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

  handleImgError(event: any) {
    event.target.src = '/default_poster.webp';
  }

  async selectMovie(movie: MovieItem): Promise<void> {
    this.selectedMovie = movie;
    const additionalDetail = await this.activeService.getIndividualMovieData(movie.id);
    this.selectedMovieAdditionalDetail = additionalDetail;
  }

  navigateToPage(direction: string): void {
    let page: number = this.movies.page;

    switch (direction) {
      case 'first':
        if (page === 1) return;
        page = 1;
        break;
      case 'previous':
        if (page === 1) return;
        page = page - 1;
        break;
      case 'next':
        if (page === this.movies.totalPages) return;
        page = page + 1;
        break;
      case 'last':
        if (page === this.movies.totalPages) return;
        page = this.movies.totalPages;
        break;
    }
    this.fireRequestChange(page);
  }

  fireRequestChange(page: number = 1): void {
    const search: string = '';
    const genre: string = '';
    this.activeService.getMovies(search, genre, page);
  }

  convertDate(date: string | undefined) {
    if (date === undefined) return 'unknown';
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
    const year: string = date.substring(0, 4);
    const month: string = date.substring(5, 7);
    const day: string = date.substring(8, 10);
    console.log(date, year, month, day);
    return [day, months[+month - 1], year].join(' ');
  }

  convertIsoDuration(isoString: string | undefined): string {
    if (isoString === undefined) return 'unknown';
    const hoursMatch = isoString.match(/(\d+)H/);
    const minutesMatch = isoString.match(/(\d+)M/);
    
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    
    const parts: Array<string> = [];
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    
    return parts.join(' ');
  }

  convertGenres(genres: Array<GenreDetail> | undefined): string {
    if (genres === undefined) return 'unknown';
    const parts: Array<string> = [];
    genres.forEach((genre: GenreDetail) => {
      parts.push(genre.title);
    });
    return parts.join(', ');
  }
}
