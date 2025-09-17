import { Component, effect, inject, OnInit } from '@angular/core';

import { ApiService } from '../../core/services/api-service';
import { Genre } from '../../core/interfaces/genre';

@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage implements OnInit {
  public apiService: ApiService = inject(ApiService);

  public genre: Genre = this.apiService.EMPTY_GENRE;
  
  constructor() {
    effect(this.handleGenreChange.bind(this));
    this.init();
  }

  ngOnInit() {
  }

  private async init() {
    await this.apiService.getGenres();
  }

  private handleGenreChange(): void {
    this.genre = this.apiService.sharedGenre();
    console.log(this.genre);
  }
}
