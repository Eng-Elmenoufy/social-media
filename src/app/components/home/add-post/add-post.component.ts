import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../services/auth.service';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-post',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.scss',
})
export class AddPostComponent {
  private auth = inject(AuthService);
  readonly title = new FormControl('', [Validators.required]);
  readonly body = new FormControl('', [Validators.required]);
  profileImage = new FormControl();

  errorTitle = signal('');
  errorBody = signal('');

  constructor() {
    merge(this.title.statusChanges, this.title.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorTitle());
    merge(this.body.statusChanges, this.body.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorBody());
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
    const formData = {
      title: this.title.value!,
      body: this.body.value!,
      image: this.profileImage!,
    };
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
          content: err.message,
        });
      },
    });
  }
}
