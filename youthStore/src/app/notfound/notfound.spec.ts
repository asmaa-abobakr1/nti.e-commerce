import { TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './notfound';
import { RouterTestingModule } from '@angular/router/testing';

describe('NotFoundComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NotFoundComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
