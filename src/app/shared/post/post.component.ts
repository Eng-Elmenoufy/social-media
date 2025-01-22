import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Post, PostComment, PostWithComments } from '../../models/post.model';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent {
  private auth = inject(AuthService);
  readonly dialog = inject(MatDialog);
  userId = this.auth.user().id;
  postData = input<Post | PostWithComments>();
  // selectedPost = input<boolean>(false);
  comment = signal<string>('');
  commented = output();
  comments = input<PostComment[] | null>(null);

  imageSrc = computed(() => {
    if (typeof this.postData()?.image !== 'object') {
      return this.postData()?.image;
    }
    return undefined;
  });

  ProfileImageSrc(data: PostComment | Post | PostWithComments) {
    if (typeof data?.author.profile_image !== 'object') {
      return data?.author.profile_image;
    }
    return 'profile.png';
  }
  constructor() {}

  sendComment() {
    if (!this.comment()) return;
    this.auth
      .SendComment(this.postData()!.id, { body: this.comment() })
      .subscribe({
        next: () => {
          this.commented.emit();
          this.auth.getPost(this.postData()!.id).subscribe();
        },
      });
    this.comment.set('');
  }

  deletePost() {
    this.dialog.open(FormComponent, {
      data: {
        type: 'Delete',
        postData: this.postData(),
      },
    });
  }

  updatePost() {
    this.dialog.open(FormComponent, {
      data: {
        type: 'Update Post',
        postData: this.postData(),
        formsFields: [
          {
            label: 'Title',
            variable: 'title',
            methodForUpdateError: 'updateErrorTitle',
            errorVariable: 'errorTitle',
            type: 'text',
          },
          {
            label: 'Body',
            variable: 'body',
            methodForUpdateError: 'updateErrorBody',
            errorVariable: 'errorBody',
            type: 'textarea',
          },
        ],
      },
    });
  }
}
