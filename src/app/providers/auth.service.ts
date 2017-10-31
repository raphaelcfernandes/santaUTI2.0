import {Injectable} from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import {DatabaseService} from './database.service';

@Injectable()
export class AuthService {
	private userKey;

	constructor(public afAuth : AngularFireAuth,private router : Router) { 
	}

	logout(){
		this.afAuth.auth.signOut();
		this.router.navigate(['/login']);
	}

	loginWithEmailAndPassword(email,password){
		this.afAuth.auth.signInWithEmailAndPassword(email,password)
		.then(value => {
			let ref = firebase.database().ref('Pessoa').orderByChild('email').equalTo(firebase.auth().currentUser.email)
			.once('value', val => {
				val.toJSON();
				this.userKey = Object.keys(val.toJSON())[0];
				this.router.navigate(['/home']);
			});			
		})
		.catch(err => {
			console.log('Something went wrong', err.message);
		});
	}

	isLoggedIn(){
		return firebase.auth().currentUser;
	}

	getUserKey(){
		return this.userKey;
	}

}
