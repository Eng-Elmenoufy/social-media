import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RegisterForm } from '../models/register-form.model';
import { Post } from '../models/post.model';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = 'https://tarmeezacademy.com/api/v1';
  message = signal<{ type: 'error' | 'success' | ''; content: string }>({
    type: '',
    content: '',
  });
  private browserHasLocalStorage: boolean =
    localStorage.getItem('token') !== null &&
    localStorage.getItem('user') !== null;
  private tokenSignal = this.browserHasLocalStorage
    ? signal<string>(localStorage.getItem('token')!)
    : signal<string>('');
  token = this.tokenSignal.asReadonly();
  private userSignal = this.browserHasLocalStorage
    ? signal<User>(JSON.parse(localStorage.getItem('user')!))
    : signal<User>('' as any);
  user = this.userSignal.asReadonly();
  constructor(private http: HttpClient) {}

  setToken(token: string) {
    this.tokenSignal.set(token);
    token !== ''
      ? localStorage.setItem('token', this.tokenSignal())
      : localStorage.removeItem('token');
  }

  setUser(user: User) {
    this.userSignal.set(user);
    user !== ('' as any)
      ? localStorage.setItem('user', JSON.stringify(this.userSignal()))
      : localStorage.removeItem('user');
  }

  Register(body: RegisterForm): Observable<AuthResponse> {
    const formData = new FormData();
    formData.append('username', body.username);
    formData.append('password', body.password);
    formData.append('image', body.image);
    formData.append('name', body.name);
    formData.append('email', body.email);
    return this.http.post<AuthResponse>(`${this.URL}/register`, formData).pipe(
      // Side effects for successful responses
      tap((res: AuthResponse) => {
        this.setToken(res.token);
        this.setUser(res.user);
      })
      // Handle errors without affecting `tap`
    );
  }

  Login(body: {
    username: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.URL}/login`, body).pipe(
      // Side effects for successful responses
      tap((res: AuthResponse) => {
        this.setToken(res.token);
        this.setUser(res.user);
      })
      // Handle errors without affecting `tap`
    );
  }

  getPosts(): Observable<{ data: Post[]; links: Object; meta: Object }> {
    return this.http.get<{ data: Post[]; links: Object; meta: Object }>(
      `${this.URL}/posts?limit=10&page=1`
    );
  }

  logout() {
    this.setToken('');
    this.setUser('' as any);
  }
}
