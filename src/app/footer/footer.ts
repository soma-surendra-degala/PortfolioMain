import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class Footer implements OnInit {

  ngOnInit(): void {
    const text = '"Code. Create. Inspire."';
    const element = document.getElementById('footer-tagline');
    let index = 0;
    let deleting = false;

    setInterval(() => {
      if (element) {
        if (!deleting && index <= text.length) {
          // Typing
          element.textContent = text.substring(0, index++);
        } else if (deleting && index >= 0) {
          // Deleting
          element.textContent = text.substring(0, index--);
        }

        // Switch mode at edges
        if (index > text.length) {
          deleting = true;
          index = text.length;
        } else if (index < 0) {
          deleting = false;
          index = 0;
        }
      }
    }, 120); // speed
  }
}
