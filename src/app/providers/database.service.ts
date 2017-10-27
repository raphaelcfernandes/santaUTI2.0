import {Injectable} from "@angular/core";
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DatabaseService {
	teste: AngularFireObject<any>;
	constructor(public db: AngularFireDatabase) {}

	getHospital(){
		this.teste = this.db.object('Hospital');
		this.teste.snapshotChanges().subscribe(action => {
			console.log(action.payload.val())
		});
		console.log(this.teste);
	}
	
}
