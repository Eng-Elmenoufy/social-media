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
import { RegisterForm } from '../../../models/register-form.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private auth = inject(AuthService);
  readonly userName = new FormControl('', [Validators.required]);
  readonly password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  readonly name = new FormControl('', [Validators.required]);
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  profileImage = new FormControl();

  errorUserName = signal('');
  errorPassword = signal('');
  errorName = signal('');
  errorEmail = signal('');

  constructor() {
    merge(this.userName.statusChanges, this.userName.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorUserName());
    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorPassword());
    merge(this.name.statusChanges, this.name.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorName());
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorEmail());
  }

  updateErrorUserName() {
    if (this.userName.hasError('required')) {
      this.errorUserName.set('You must enter your user name');
    } else {
      this.errorUserName.set('');
    }
  }

  updateErrorPassword() {
    if (this.password.hasError('required')) {
      this.errorPassword.set('You must enter a password');
    } else if (this.password.hasError('minlength')) {
      this.errorPassword.set('your password must be at least 6 characters');
    } else {
      this.errorPassword.set('');
    }
  }

  updateErrorName() {
    if (this.name.hasError('required')) {
      this.errorName.set('You must enter your name');
    } else {
      this.errorName.set('');
    }
  }

  updateErrorEmail() {
    if (this.email.hasError('required')) {
      this.errorEmail.set('You must enter Your email');
    } else if (this.email.hasError('email')) {
      this.errorEmail.set('Not a valid email');
    } else {
      this.errorEmail.set('');
    }
  }

  imageUpload(event: any) {
    this.profileImage = event.target.files[0];
  }

  onSubmit() {
    if (
      this.userName.valid &&
      this.password.valid &&
      this.name.valid &&
      this.email.valid
    ) {
      const formData: RegisterForm = {
        username: this.userName.value!,
        password: this.password.value!,
        image: this.profileImage!,
        name: this.name.value!,
        email: this.email.value!,
      };
      this.auth.Register(formData).subscribe({
        next: () => {
          this.auth.message.set({
            type: 'success',
            content:
              'Congratulations! Your registration is complete. Enjoy using our Website 🎉',
          });
        },
        error: (err) => {
          this.auth.message.set({
            type: 'error',
            content: err.message,
          });
        },
      });
    }
  }
}
