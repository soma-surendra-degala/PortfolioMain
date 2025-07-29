import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../scroll';


@Component({
  selector: 'app-about',
  imports: [ScrollRevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {animate: boolean = false;


  ngOnInit():void{
     setTimeout(() => {
      this.animate = true;
    }, 500); 


  }

}
