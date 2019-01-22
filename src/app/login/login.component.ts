import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  email: '';
  password: '';
  event: boolean;

  public loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit() {
  }

  doLogin(event) {
    console.log("here");
    this.authService.loginWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password);
  }
}
