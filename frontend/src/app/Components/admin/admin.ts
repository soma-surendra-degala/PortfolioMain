import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,
    HttpClientModule,
    RouterOutlet,
    RouterModule,
    ],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin {
}