import { Component, Inject, input } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: {
      message: { type: 'error' | 'success' | ''; content: string };
    }
  ) {}
}
