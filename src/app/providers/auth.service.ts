import {Injectable} from "@angular/core";
import { Router } from "@angular/router";

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
	user: Observable<firebase.User>;

	constructor(public afAuth : AngularFireAuth) { 
		this.user = afAuth.authState;
	}

	logout(){
		this.afAuth.auth.signOut();
	}

	loginWithEmailAndPassword(email,password){
		this.afAuth.auth.signInWithEmailAndPassword(email,password)
		.then(value => {
			console.log('Nice, it worked');
		})
		.catch(err => {
			console.log('Something went wrong', err.message);
		});
	}
}
