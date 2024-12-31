import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
// import { HomeComponent } from './components/home/home.component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
