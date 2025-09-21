import { Component, inject, Input } from '@angular/core';
import { MovieDetail, MovieItem } from '../../core/interfaces/movies';
import { ConversionService } from '../../core/services/conversion-service';

@Component({
  selector: 'movie-display-component',
  standalone: false,
  templateUrl: './movie-display-component.html',
  styleUrl: './movie-display-component.css'
})
export class MovieDisplayComponent {
  @Input() selectedMovie: MovieItem | null = null;
  @Input() additionalDetail: MovieDetail | null = null;

  private conversionService: ConversionService = inject(ConversionService);
  public convertDate = this.conversionService.convertDate;
  public convertGenres = this.conversionService.convertGenres;
  public convertIsoDuration = this.conversionService.convertIsoDuration;

  handleImgError(event: any) {
    event.target.src = '/default_poster.webp';
  }
}
