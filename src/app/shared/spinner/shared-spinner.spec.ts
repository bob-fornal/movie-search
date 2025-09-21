import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSpinner } from './shared-spinner';

describe('Spinner', () => {
  let component: SharedSpinner;
  let fixture: ComponentFixture<SharedSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharedSpinner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedSpinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
