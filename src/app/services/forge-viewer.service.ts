import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

interface Token {
  access_token: string;
  expires_in: number;
}
interface Data {
  id: number;
  children: any;
  parent: any;
  isLeaf: boolean;
  data: any;
}
declare const Autodesk: any;
declare const THREE: any;

@Injectable({
  providedIn: 'root',
})
export class ForgeViewerService {
  constructor(private http: HttpClient) {}

  public getApiAccessToken(): Observable<any> {
    const baseURL = 'http://localhost:3000';
    const oauth = '/api/forge/oauth/token';
    return this.http.get<Token>(`${baseURL}${oauth}`).pipe(
      tap((data: Token) => {
        localStorage.setItem('token', data.access_token);
      })
    );
  }
  public getForgeToken(onSuccess: any) {
    const access_token = localStorage.getItem('token');
    const expires_in = 5 * 60;
    onSuccess(access_token, expires_in);
  }
}
