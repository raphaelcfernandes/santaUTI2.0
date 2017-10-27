import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { DatabaseService} from '../providers/database.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	title = 'app';
	email:string;
	password:string;
	constructor(private authService : AuthService, 
		private databaseService: DatabaseService){}


	login(){
		let retorno = this.authService.loginWithEmailAndPassword(this.email,this.password);
		this.email = this.password = '';		
	}
	ngOnInit() {
	}

}
