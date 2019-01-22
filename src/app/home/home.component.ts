import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { DatabaseService } from '../providers/database.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  private pacientes: any[] = [];
  private profissionais: any[] = [];
  show = false;


  constructor(
    private db: DatabaseService,
    private router: Router) {
    this.subscriptions.add(this.db.getProfissionaisFromHospitalKey('DcbtizNr0ADNNnd0evlN').snapshotChanges().subscribe(data => {
      data.forEach(profissionais => {
        this.profissionais.push({ 'profissionalKey': profissionais.key, 'profissionalData': profissionais.payload.val() });
      });
    }));
  }



  ngOnInit() {
    // this.show = true;
    // this.subscriptions.add(this.db.getPacientesFromHospitalKey('DcbtizNr0ADNNnd0evlN').snapshotChanges().subscribe(actions => {
    //   actions.forEach(pacientes => {
    //     this.profissionais.forEach(profissional => {
    //       if (profissional.profissionalKey === pacientes.payload.val().profissionalResponsavel) {
    //         this.pacientes.push({
    //           'pacienteKey': pacientes.key,
    //           'nome': pacientes.payload.val().nome,
    //           'sobrenome': pacientes.payload.val().sobrenome,
    //           'box': pacientes.payload.val().box,
    //           'leito': pacientes.payload.val().leito,
    //           'medicoResponsavel': profissional.profissionalData.nome + ' ' + profissional.profissionalData.sobrenome
    //         });
    //       }
    //     });

    //   });
    //   this.show = false;
    // }));

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  liClicked(item) {
    this.router.navigate(['/ficha', item.pacienteKey]);
  }
}
