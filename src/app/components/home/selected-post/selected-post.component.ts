import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { PostComment, PostWithComments } from '../../../models/post.model';
import { PostComponent } from '../post/post.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment',
  imports: [PostComponent, MatFormFieldModule, FormsModule],
  templateUrl: './selected-post.component.html',
  styleUrl: './selected-post.component.scss',
})
export class SelectedPostComponent implements OnInit {
  private auth = inject(AuthService);
  postId = signal<number>(0);
  comments = signal<PostComment[]>([]);
  selectedPost = signal<PostWithComments | null>(null);

  constructor(private router: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.params
      .pipe(
        switchMap((params) => {
          this.postId.set(params['postId']);
          return this.auth.getPost(this.postId());
        })
      )
      .subscribe({
        next: (post) => {
          this.selectedPost.set(post.data);
          this.comments.set(post.data.comments);
        },
        error: (err) => {
          this.auth.message.set({
            type: 'error',
            content: err.error.message,
          });
        },
      });
  }

  updateComments() {
    this.auth.getPost(this.postId()).subscribe({
      next: (post) => {
        this.selectedPost.set(post.data);
        this.comments.set(post.data.comments);
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
