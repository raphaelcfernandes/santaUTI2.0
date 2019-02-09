import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList, AngularFireAction } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';
import { DatePipe } from '@angular/common';
import { AuthService } from '../providers/auth.service';

@Injectable()
export class DatabaseService {

  private hospitalKey: string;
  private profissionais: any[] = [];
  private fichaObject: any[] = [];

  constructor(private db: AngularFireDatabase, private auth: AuthService) { }

  setHospitalKey(nome: string) {
    // this.db.list('Hospital', ref => ref.orderByChild('nome').equalTo(nome)).snapshotChanges().map(actions => {
    //   actions.forEach(data => {
    //     this.hospitalKey = data.key;
    //   });
    // });
    this.hospitalKey = 'Santa Clara'
  }

  getPacientesFromHospitalKey(key: string): AngularFireList<any[]> {
    return this.db.list('Hospital/' + key + '/Pacientes');
  }

  getHospitalKey() {
    if (this.hospitalKey === undefined) {
      this.setHospitalKey('Santa Clara');
    }
    return this.hospitalKey;
  }

  getProfissionaisFromHospitalKey(key: string): AngularFireList<any> {
    return this.db.list('Hospital/' + key + '/Profissionais');
  }

  getLastFichaByPacienteKey(key: string): AngularFireList<any[]> {
    return this.db.list('Hospital/DcbtizNr0ADNNnd0evlN/Fichas', ref => ref.orderByChild('pacienteKey').equalTo(key).limitToLast(1));
  }

  getAllFichasByPacienteKey(key: string): AngularFireList<any[]> {
    return this.db.list('Hospital/DcbtizNr0ADNNnd0evlN/Fichas', ref => ref.orderByChild('pacienteKey').equalTo(key));
  }

  getDiagosnitcosByPacienteKey(key: string): AngularFireList<any[]> {
    return this.db.list('Hospital/DcbtizNr0ADNNnd0evlN/Pacientes/' + key + '/Diagnosticos');
  }
}
