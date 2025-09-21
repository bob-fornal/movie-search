import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private _isLoading = new BehaviorSubject<boolean>(false);
  public readonly isLoading$ = this._isLoading.asObservable();
  private count: number = 0;

  show() {
    this.count++;
    if (this.count > 0) this._isLoading.next(true);
    console.log(this.count);
  }

  hide() {
    this.count--;
    if (this.count <= 0) {
      this._isLoading.next(false);
      this.count = 0;
    }
    console.log(this.count);
  }
}