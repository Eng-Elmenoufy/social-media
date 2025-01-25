import { Component, computed, inject, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { FormComponent } from '../../shared/form/form.component';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly dialog = inject(MatDialog);
  auth = inject(AuthService);
  router = inject(Router);
  token: Signal<string> = this.auth.token;
  user: Signal<User> = this.auth.user;

  ProfileImageSrc = computed(() => {
    if (typeof this.user()?.profile_image !== 'object') {
      return this.user()?.profile_image;
    }
    return 'profile.png';
  });

  userProfile() {
    if (this.token()) {
      this.router.navigate(['/profile/', this.auth.user().id]);
    } else {
      this.auth.message.set({
        type: 'error',
        content: 'You need to be logged in to view your profile.',
      });
    }
  }

  openLogin() {
    this.dialog.open(FormComponent, {
      data: {
        type: 'Login',
        formsFields: [
          {
            label: 'User Name',
            variable: 'userName',
            methodForUpdateError: 'updateErrorUserName',
            errorVariable: 'errorUserName',
            type: 'text',
          },
          {
            label: 'Password',
            variable: 'password',
            methodForUpdateError: 'updateErrorPassword',
            errorVariable: 'errorPassword',
            type: 'password',
          },
        ],
      },
    });
  }

  openLogout(): void {
    this.dialog.open(FormComponent, {
      data: {
        type: 'Logout',
      },
    });
  }
  openRegister() {
    this.dialog.open(FormComponent, {
      data: {
        type: 'Register',
        formsFields: [
          {
            label: 'User Name',
            variable: 'userName',
            methodForUpdateError: 'updateErrorUserName',
            errorVariable: 'errorUserName',
            type: 'text',
          },
          {
            label: 'Password',
            variable: 'password',
            methodForUpdateError: 'updateErrorPassword',
            errorVariable: 'errorPassword',
            type: 'password',
          },
          {
            label: 'Name',
            variable: 'name',
            methodForUpdateError: 'updateErrorName',
            errorVariable: 'errorName',
            type: 'text',
          },
          {
            label: 'Email',
            variable: 'email',
            methodForUpdateError: 'updateErrorEmail',
            errorVariable: 'errorEmail',
            type: 'email',
          },
          {
            label: 'Profile Image',
            variable: 'profileImage',
            methodForUpdateError: 'updateErrorProfileImage',
            errorVariable: 'errorProfileImage',
            type: 'image',
          },
        ],
      },
    });
  }
}
