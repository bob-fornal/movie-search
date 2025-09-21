import { Component, inject } from '@angular/core';
import { SpinnerService } from '../../core/services/spinner-service';

@Component({
  selector: 'shared-spinner',
  standalone: false,
  templateUrl: './shared-spinner.html',
  styleUrl: './shared-spinner.css'
})
export class SharedSpinner {
  private service: SpinnerService = inject(SpinnerService);
  isLoading$ = this.service.isLoading$;
}
