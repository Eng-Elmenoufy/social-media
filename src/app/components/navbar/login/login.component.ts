import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  auth = inject(AuthService);
  readonly userName = new FormControl('', [Validators.required]);
  readonly password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  errorUserName = signal('');
  errorPassword = signal('');

  constructor() {
    merge(this.userName.statusChanges, this.userName.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorUserName());
    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorPassword());
  }

  updateErrorUserName() {
    if (this.userName.hasError('required')) {
      this.errorUserName.set('You must enter a value');
    } else {
      this.errorUserName.set('');
    }
  }
  updateErrorPassword() {
    if (this.password.hasError('required')) {
      this.errorPassword.set('You must enter a password');
    } else if (this.password.hasError('minlength')) {
      this.errorPassword.set('your password must be at least 8 characters');
    } else {
      this.errorPassword.set('');
    }
  }

  onLogin() {
    this.auth
      .Login({
        username: this.userName.value!,
        password: this.password.value!,
      })
      .subscribe({
        next: () => {
          this.auth.message.set({
            type: 'success',
            content: 'Welcome back! You are now logged in.',
          });
        },
        error: (err) => {
          this.auth.message.set({
            type: 'error',
            content: err.error.message,
          });
        },
      });
  }
}
