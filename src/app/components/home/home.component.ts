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
  posts: WritableSignal<Post[]> = signal([]);
  private auth = inject(AuthService);

  constructor() {
    this.auth.getPosts().subscribe(
      (posts: any) => {
        this.posts.set(posts.data);
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }
}
