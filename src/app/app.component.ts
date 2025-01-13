import { Component, effect, inject, WritableSignal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { MessageComponent } from './components/message/message.component';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddPostComponent } from './components/home/add-post/add-post.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private auth = inject(AuthService);
  readonly dialog = inject(MatDialog);
  message: WritableSignal<{ type: 'error' | 'success' | ''; content: string }> =
    this.auth.message;
  private _snackBar = inject(MatSnackBar);

  constructor() {
    effect(() => {
      if (!this.message().content) return;
      this._snackBar.openFromComponent(MessageComponent, {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: [this.message().type],
        data: { message: this.message() },
      });
    });
  }

  addPost() {
    const dialogRef = this.dialog.open(AddPostComponent);
    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
}
