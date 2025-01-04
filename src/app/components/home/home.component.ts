import { Component, inject, signal, WritableSignal } from '@angular/core';
import { PostComponent } from './post/post.component';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  posts = signal<Post[]>([]);
  private auth = inject(AuthService);

  constructor() {
    this.auth.getPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts.data);
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
