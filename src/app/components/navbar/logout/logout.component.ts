import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-logout',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent {
  private auth = inject(AuthService);
  onLogout() {
    this.auth.logout();
    this.auth.message.set({
      type: 'success',
      content: 'You have been logged out. See you soon!',
    });
  }
}
