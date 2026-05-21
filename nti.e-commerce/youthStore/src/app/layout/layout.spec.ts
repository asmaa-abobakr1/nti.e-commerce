import { TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LayoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LayoutComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
