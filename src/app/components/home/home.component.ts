import { Component, inject } from '@angular/core';

import { PostComponent } from './post/post.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private auth = inject(AuthService);
  posts = this.auth.posts;

  constructor() {
    this.auth.getPosts().subscribe({
      error: (err) => {
        this.auth.message.set({
          type: 'error',
          content: err.error.message,
        });
      },
    });
  }
}
