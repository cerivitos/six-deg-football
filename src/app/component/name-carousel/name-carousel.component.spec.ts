import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameCarouselComponent } from './name-carousel.component';

describe('NameCarouselComponent', () => {
  let component: NameCarouselComponent;
  let fixture: ComponentFixture<NameCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NameCarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NameCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
