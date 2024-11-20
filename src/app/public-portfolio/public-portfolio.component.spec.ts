import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPortfolioComponent } from './public-portfolio.component';

describe('PublicPortfolioComponent', () => {
  let component: PublicPortfolioComponent;
  let fixture: ComponentFixture<PublicPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicPortfolioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
