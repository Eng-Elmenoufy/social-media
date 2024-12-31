import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../models/register-form.model';
import { Post } from '../models/post.model';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';
import { RegisterResponse } from '../models/register-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = 'https://tarmeezacademy.com/api/v1';
  private token = signal<string | undefined>(undefined);
  // private tokenValue = new BehaviorSubject<string | undefined>(undefined);
  // token$ = this.tokenValue.asObservable();
  private user = signal<User | undefined>(undefined);
  // private userValue = new BehaviorSubject<User | undefined>(undefined);
  // user$ = this.userValue.asObservable();
  constructor(private http: HttpClient) {}

  getToken() {
    return this.token();
  }

  getUser() {
    return this.user();
  }

  setToken(token: string | undefined) {
    this.token.set(token);
    token !== undefined
      ? localStorage.setItem('token', this.token()!)
      : localStorage.removeItem('token');
  }

  setUser(user: User | undefined) {
    this.user.set(user);
    user !== undefined
      ? localStorage.setItem('user', JSON.stringify(this.user()))
      : localStorage.removeItem('user');
  }

  Register(body: RegisterForm): Observable<RegisterResponse> {
    const formData = new FormData();
    formData.append('username', body.username);
    formData.append('password', body.password);
    formData.append('image', body.image);
    formData.append('name', body.name);
    formData.append('email', body.email);
    return this.http
      .post<RegisterResponse>(`${this.URL}/register`, formData)
      .pipe(
        tap((res: RegisterResponse) => {
          this.setToken(res.token);
          this.setUser(res.user);
        })
      );
  }

  Login(body: { username: string; password: string }) {
    this.http.post(`${this.URL}/login`, body).subscribe((res: any) => {
      this.setToken(res.token);
      this.setUser(res.user);
    });
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.URL}/posts?limit=10&page=1`);
  }

  logout() {
    this.setToken(undefined);
    this.setUser(undefined);
  }
}
