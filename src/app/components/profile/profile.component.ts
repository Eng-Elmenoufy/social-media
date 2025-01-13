import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post.model';
import { PostComponent } from '../home/post/post.component';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  imports: [PostComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private auth = inject(AuthService);
  userId = signal<string | null>('');
  user = signal<User | null>(null);
  posts = this.auth.userPosts;

  ProfileImageSrc = computed(() => {
    if (typeof this.user()?.profile_image !== 'object') {
      return this.user()?.profile_image;
    }
    return 'profile.png';
  });

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId.set(params.get('userId'));
    });
    this.auth.getUser(Number(this.userId())).subscribe({
      next: (user) => {
        this.user.set(user.data);
      },
      error: (err) => {
        this.auth.message.set({
          type: 'error',
          content: err.error.message,
        });
      },
    });

    this.auth.getUserPosts(Number(this.userId())).subscribe({
      error: (err) => {
        this.auth.message.set({
          type: 'error',
          content: err.error.message,
        });
      },
    });
  }
}
