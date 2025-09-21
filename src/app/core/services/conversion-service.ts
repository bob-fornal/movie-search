import { Injectable } from '@angular/core';
import { GenreDetail } from '../interfaces/genre';

@Injectable({
  providedIn: 'root'
})
export class ConversionService {
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
