import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { Post, PostWithComments } from '../../models/post.model';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RegisterForm } from '../../models/register-form.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    MatDialogClose,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent implements OnInit {
  // formType = input<string>();
  private auth = inject(AuthService);

  readonly userName = new FormControl('', [Validators.required]);
  readonly password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  readonly name = new FormControl('', [Validators.required]);
  readonly email = new FormControl('', [Validators.email]);
  title = new FormControl('');
  body = new FormControl('', [Validators.required]);
  profileImage = new FormControl();
  private route = inject(Router);

  errorUserName = signal('');
  errorPassword = signal('');
  errorName = signal('');
  errorEmail = signal('');
  errorTitle = signal('');
  errorBody = signal('');

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      type:
        | 'Delete'
        | 'Login'
        | 'Register'
        | 'Logout'
        | 'Update Post'
        | 'Add Post';
      postData?: Post | PostWithComments;
      formsFields?: {
        label: string;
        variable: 'userName' | 'password' | 'name' | 'email' | 'profileImage';
        methodForUpdateError:
          | 'updateErrorUserName'
          | 'updateErrorPassword'
          | 'updateErrorName'
          | 'updateErrorEmail';
        errorVariable:
          | 'errorUserName'
          | 'errorPassword'
          | 'errorName'
          | 'errorEmail';
        type: 'password' | 'text' | 'image' | 'textarea';
      }[];
    }
  ) {
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
    merge(this.title.statusChanges, this.title.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorTitle());
    merge(this.body.statusChanges, this.body.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorBody());
  }

  ngOnInit(): void {
    if (this.data.type === 'Update Post') {
      this.title.setValue(this.data.postData?.title || '');
      this.body.setValue(this.data.postData?.body || '');
    }
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

  updateErrorTitle() {
    if (this.title.hasError('required')) {
      this.errorTitle.set('You must enter a value');
    } else {
      this.errorTitle.set('');
    }
  }

  updateErrorBody() {
    if (this.body.hasError('required')) {
      this.errorBody.set('You must enter a value');
    } else {
      this.errorBody.set('');
    }
  }

  imageUpload(event: any) {
    this.profileImage = event.target.files[0];
  }

  onSubmit() {
    if (this.data.type === 'Login') {
      if (this.userName.valid && this.password.valid) {
        this.auth
          .login({
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
    } else if (this.data.type === 'Register') {
      if (
        this.userName.valid &&
        this.password.valid &&
        this.name.valid &&
        this.email.valid
      ) {
        let formData: RegisterForm = {
          username: this.userName.value!,
          password: this.password.value!,
          name: this.name.value!,
        };

        if (this.profileImage?.value !== null) {
          formData = { ...formData, image: this.profileImage };
        }

        if (this.email.value) {
          formData = { ...formData, email: this.email.value };
        }

        this.auth.register(formData).subscribe({
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
              content: err.error.message,
            });
          },
        });
      }
    } else if (this.data.type === 'Logout') {
      this.auth.logout();
      this.route.navigate(['']);
      this.auth.message.set({
        type: 'success',
        content: 'You have been logged out. See you soon!',
      });
    } else if (this.data.type === 'Add Post') {
      type FormDataType = {
        body: string | null;
        image?: any;
        title?: string;
      };
      let formData: FormDataType = {
        body: this.body.value,
      };

      if (this.profileImage?.value !== null) {
        formData = { ...formData, image: this.profileImage };
      }

      if (this.title.value) {
        formData = { ...formData, title: this.title.value };
      }

      this.auth.addPost(formData).subscribe({
        next: () => {
          this.auth.message.set({
            type: 'success',
            content: 'Congratulations! You added a post 🎉',
          });
        },
        error: (err) => {
          this.auth.message.set({
            type: 'error',
            content: err.error.message,
          });
        },
      });
    } else if (this.data.type === 'Delete') {
      this.auth.deletePost(this.data.postData!.id).subscribe({
        next: () => {
          this.auth.message.set({
            type: 'success',
            content: 'Congratulations! You deleted the post.',
          });
        },
        error: (err) => {
          this.auth.message.set({
            type: 'error',
            content: err.error.message,
          });
        },
      });
    } else if (this.data.type === 'Update Post') {
      this.auth
        .updatePost(this.data.postData!.id, {
          title: this.title.value!,
          body: this.body.value!,
        })
        .subscribe({
          next: () => {
            this.auth.message.set({
              type: 'success',
              content: 'Congratulations! You updated the post.',
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
    console.log(`email ${this.errorEmail()}`);
    console.log(`body ${this.errorBody()}`);
    console.log(`name ${this.errorName()}`);
    console.log(`password ${this.errorPassword()}`);
    console.log(`title ${this.errorTitle()}`);
    console.log(`userName ${this.errorUserName()}`);
    if (this.data.formsFields && this.data.formsFields.length > 0) {
      console.log(`${this[this.data.formsFields[0].errorVariable]()}`);
    }
  }
}
