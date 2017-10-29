import {Injectable} from "@angular/core";
import { AngularFireDatabase, AngularFireObject, AngularFireList, AngularFireAction} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';
@Injectable()
export class DatabaseService {
	
	constructor(private db: AngularFireDatabase) {	}

	getHospital() : AngularFireList<any>{
		return this.db.list('Hospital',ref => ref.orderByChild('nome').equalTo('Santa Clara'));
	}
}
