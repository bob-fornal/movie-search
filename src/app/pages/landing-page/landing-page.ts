import { Component, effect, inject } from '@angular/core';

import { ApiServiceRest } from '../../core/services/api-service-rest';
import { Genre, GenreItem } from '../../core/interfaces/genre';

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
  
  constructor() {
    effect(this.handleGenreChange.bind(this));
    this.init();
  }

  private init() {
    this.activeService.getGenres();
  }

  private handleGenreChange(): void {
    this.genre = this.activeService.sharedGenre();
    console.log(this.genre);
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
}
