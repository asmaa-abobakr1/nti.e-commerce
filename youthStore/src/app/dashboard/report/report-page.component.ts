import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-report-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.css']
})
export class ReportPageComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/v1/reports/sales';

  startDate: string = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
  endDate: string = new Date().toISOString().split('T')[0];

  summary: any = { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 };
  dailyStats: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  ngOnInit() {
    this.fetchReport();
  }

  fetchReport() {
    if (!this.startDate || !this.endDate) {
      this.errorMessage = 'Please select both start and end dates.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    let params = new HttpParams()
      .set('startDate', this.startDate)
      .set('endDate', this.endDate);

    this.http.get(this.apiUrl, { params }).subscribe({
      next: (res: any) => {
        this.summary = res.data.summary;
        this.dailyStats = res.data.dailyStats;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to load report. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
