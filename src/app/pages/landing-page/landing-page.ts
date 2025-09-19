import { Component, effect, inject } from '@angular/core';

import { ApiServiceRest } from '../../core/services/api-service-rest';
import { Genre, GenreDetail, GenreItem } from '../../core/interfaces/genre';
import { MovieDetail, MovieItem, Movies, MovieTitle, MovieTitles } from '../../core/interfaces/movies';

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

  public titles: MovieTitles = this.activeService.EMPTY_MOVIE_TITLES;
  public selectedTitleId: string | null = null;
  
  constructor() {
    effect(this.handleGenreChange.bind(this));
    effect(this.handleMovieChange.bind(this));
    effect(this.handleTitleChange.bind(this));
    this.init();
  }

  private async init() {
    await this.activeService.getGenres();
    await this.activeService.getMovies();
    await this.activeService.getMovieTitles();
  }

  private handleGenreChange(): void {
    this.genre = this.activeService.sharedGenre();
    console.log(this.genre);
  }

  private handleMovieChange(): void {
    this.movies = this.activeService.sharedMovies();
    console.log(this.movies);
    if (this.movies.data.length > 0) {
      const index: number = this.selectedTitleId === null
        ? 0
        : this.getIndexOfSelectedTitle();
      console.log(index);
      this.selectMovie(this.movies.data[index]);
    }
  }

  private getIndexOfSelectedTitle(): number {
    return this.movies.data.findIndex((value: MovieItem) => {
      console.log(value, this.selectedTitleId);
      return value.id === this.selectedTitleId;
    });
  }

  private handleTitleChange(): void {
    this.titles = this.activeService.sharedTitles();
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

  async selectTitle(id: string | null) {
    if (id === null) {
      this.activeService.getMovies();
    } else {
      this.clearFilterItem();
      const needToFind: boolean = this.isMovieListed(id);
      if (needToFind === true) {
        this.activeService.findMovieGroup(id);
      }
    }
  }

  isMovieListed(id: string) {
    let needToFind: boolean = true;

    for (let i = 0, len = this.movies.data.length; i < len; i++) {
      if (this.movies.data[i].id === id) {
        this.selectMovie(this.movies.data[i]);
        needToFind = false;
        break;
      }
    }

    return needToFind;
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
    if (date === null) return 'unknown';

    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
    const year: string = date.substring(0, 4);
    const month: string = date.substring(5, 7);
    const day: string = date.substring(8, 10);
    return [day, months[+month - 1], year].join(' ');
  }

  convertIsoDuration(isoString: string | undefined): string {
    if (isoString === undefined) return 'unknown';
    if (isoString === null) return 'unknown';

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
    if (genres === null) return 'unknown';

    const parts: Array<string> = [];
    genres.forEach((genre: GenreDetail) => {
      parts.push(genre.title);
    });
    return parts.join(', ');
  }
}
