import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AutenticacionService } from '../../core/service/autenticacion.service';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit { 
  token: string | null = null;
  userName: string | null = null;

  constructor(private authService: AutenticacionService) { }

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.userName = this.authService.getUserName();
    
    console.log('Token obtenido:', this.token);
    console.log('Usuario logueado:', this.userName);
  }
}