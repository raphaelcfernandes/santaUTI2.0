import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  title = 'app';
  email: string;
  password: string;
  constructor(private authService: AuthService) {}
  login() {
    this.authService.loginWithEmailAndPassword(this.email, this.password);
    this.email = this.password = '';
  }
  ngOnInit() {
  }

}
