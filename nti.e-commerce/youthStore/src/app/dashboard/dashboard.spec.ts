import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
