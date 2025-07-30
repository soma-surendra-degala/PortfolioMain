import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-overlay">
      <div class="spinner"></div>
      <p class="loader-text">{{ message }}</p>
    </div>
  `,
  styleUrls: ['./loader.css']
})
export class Loader {
  @Input() message: string = 'Loading...';
}
