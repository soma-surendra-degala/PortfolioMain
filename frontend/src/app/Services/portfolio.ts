import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Portfolio {
  private apiUrl = 'https://portfoliomain-sbsy.onrender.com';

  constructor(private http: HttpClient) {}

  // GET Portfolio
  getPortfolio(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }

  // SAVE using FormData (with files)
  savePortfolio(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, formData);
  }

  // SAVE using plain JSON (no files)
  updatePortfolio(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, data);
  }
}
