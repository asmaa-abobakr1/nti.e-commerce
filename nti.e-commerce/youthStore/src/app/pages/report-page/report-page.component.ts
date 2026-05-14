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

  summary: any = { totalRevenue: 0, totalOrders: 0 };
  dailyStats: any[] = [];

  ngOnInit() {
    this.fetchReport();
  }

  fetchReport() {
    let params = new HttpParams()
      .set('startDate', this.startDate)
      .set('endDate', this.endDate);

    this.http.get(this.apiUrl, { params }).subscribe((res: any) => {
      this.summary = res.data.summary;
      this.dailyStats = res.data.dailyStats;
    });
  }
}
