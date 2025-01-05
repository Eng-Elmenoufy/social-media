import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { PostWithComments } from '../../../models/post.model';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-comment',
  imports: [PostComponent],
  templateUrl: './selected-post.component.html',
  styleUrl: './selected-post.component.scss',
})
export class SelectedPostComponent implements OnInit {
  private auth = inject(AuthService);
  selectedPost = signal<PostWithComments | null>(null);

  constructor(private router: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.params
      .pipe(
        switchMap((params) => {
          const postId = params['postId'];
          return this.auth.getPost(postId);
        })
      )
      .subscribe({
        next: (post) => {
          this.selectedPost.set(post.data);
          this.auth.comments.set(post.data.comments);
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
