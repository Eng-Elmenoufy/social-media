import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SelectedPostComponent } from './components/home/selected-post/selected-post.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile/:userId', component: ProfileComponent },
  { path: 'post/:postId', component: SelectedPostComponent },
];
