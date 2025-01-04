import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-comment',
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent implements OnInit {
  private auth = inject(AuthService);
  constructor(private router: ActivatedRoute) {}
  ngOnInit(): void {
    // this.router.params.pipe(
    //   switchMap(params => {
    //     const postId = params['postId'];
    //     return this.auth.commentPost(postId);
    //   })
    //   ).subscribe({
    //     next: ()
    // })
  }
}
