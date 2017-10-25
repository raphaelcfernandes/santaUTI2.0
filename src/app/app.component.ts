import { Component } from '@angular/core';
import { AuthService } from './providers/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  email:string;
  password:string;

  constructor(public authService : AuthService){}

  login(){
  	this.authService.loginWithEmailAndPassword(this.email,this.password);
  	this.email = this.password = '';
  }
}
