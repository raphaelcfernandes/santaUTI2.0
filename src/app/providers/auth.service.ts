import {Injectable} from "@angular/core";
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

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
