import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  email: '';
  password: '';
  event: boolean;
  constructor(private authService: AuthService) {}
  login() {
    this.authService.loginWithEmailAndPassword(this.email, this.password);
  }

  ngOnInit() {
  }

}
