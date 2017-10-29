import { Component, OnInit } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { DatabaseService } from '../providers/database.service';
import {Injectable} from "@angular/core";

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit {
	pacientes: any;
	
	constructor(private authService : AuthService, private db: DatabaseService) { 		

	}

	logout(){
		this.authService.logout();
	}
	ngOnInit() {
		this.pacientes = this.db.getHospital().snapshotChanges().subscribe(actions => {
			actions.forEach(action => {
				console.log(action.key);
				console.log(action.payload.val());
				console.log(Object.keys(action.payload.val().Profissionais));
			});
		});
	}
	ngOnDestroy(){
		this.pacientes.unsubscribe();
	}
}

// data => {
// 				console.log(data[0].Pacientes);
// 				let keys = Object.keys(data[0].Pacientes);
// 				keys.forEach(data => { 
// 					this.pacientes.push(data);
// 				})
// 				// this.pacientes = Object.keys(data[0].Pacientes);
// 				// this.pacientes.push(Object.keys(data[0].Pacientes).map((key)=>{ return data[0].Pacientes[key]}));

// 				console.log(this.pacientes);
