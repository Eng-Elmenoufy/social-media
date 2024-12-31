import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Post } from '../../../models/post.model';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent {
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
