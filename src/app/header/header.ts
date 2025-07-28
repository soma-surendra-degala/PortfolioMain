import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Contact } from '../contact/contact';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule,CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  menuOpen = false;

    toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }


}
