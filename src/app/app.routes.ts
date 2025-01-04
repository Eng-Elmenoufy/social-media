import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CommentComponent } from './components/home/comment/comment.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile/:userId', component: ProfileComponent },
  { path: 'post/:postId', component: CommentComponent },
];
