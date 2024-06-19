import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.cookieService.set('token', response.token);
            console.log('Login succesful, token stored')
          } else {
            console.error('No token in response');
          }
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error:HttpErrorResponse) {
    console.error('An error occurred',error.error);
    return throwError('Something bad happened; please try agin later');
  }

  logout(): void {
    this.cookieService.delete('token');
  }

  isLoggedIn(): boolean {
    return this.cookieService.check('token');
  }
}
