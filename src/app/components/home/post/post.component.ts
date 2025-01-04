import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

import { Post } from '../../../models/post.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, RouterModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent {
  private auth = inject(AuthService);
  userId = this.auth.user().id;
  postData = input<Post>();
  imageSrc = computed(() => {
    if (typeof this.postData()?.image !== 'object') {
      return this.postData()?.image;
    }
    return undefined;
  });
  ProfileImageSrc = computed(() => {
    if (typeof this.postData()?.author.profile_image !== 'object') {
      return this.postData()?.author.profile_image;
    }
    return 'profile.png';
  });
  constructor() {}
}
