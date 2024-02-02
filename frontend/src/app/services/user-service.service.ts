import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpClient) { }

  sellStock(stockSymbol: string, quantity: number): Observable<any> {
    const url = 'http://localhost:3000/api/users/sell-stock';
    const requestBody = { symbol: stockSymbol, quantity: quantity };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('loginToken')}`
    });

    return this.http.post<any>(url, requestBody, { headers });
  }

  buyStock(stockSymbol: string, quantity: number): Observable<any> {
    const url = 'http://localhost:3000/api/users/buy-stock';
    const requestBody = { symbol: stockSymbol, quantity: quantity };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('loginToken')}`
    });

    return this.http.post<any>(url, requestBody, { headers });
  }

}

/*
register
login
deposit
getUserPortfolio
getUserTransactions
resetUserAccount
getUserDetails
changeUserDetails
*/