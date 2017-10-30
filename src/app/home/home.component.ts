import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../providers/auth.service';
import { DatabaseService } from '../providers/database.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit  {
	private pacientes: any[] = [];
	private profissionaisSubscription: any;
	private pacientesSubscription: any;
	
	private fichas: any[] = [];
	private profissionais: any[] = [];

	constructor(private authService : AuthService, private db: DatabaseService) {
		this.profissionaisSubscription = this.db.getProfissionaisFromHospitalKey('DcbtizNr0ADNNnd0evlN').subscribe(data => {
			data.forEach(profissionais => {
				this.profissionais.push({'profissionalKey': profissionais.key, 'profissionalData': profissionais.payload.val()});
			});
		});
	}

	logout(){
		this.authService.logout();
	}

	ngOnInit() {
		this.pacientesSubscription = this.db.getPacientesFromHospitalKey('DcbtizNr0ADNNnd0evlN').snapshotChanges().subscribe(actions => {
			actions.forEach(pacientes =>{
				this.profissionais.forEach(profissional =>{
					if(profissional.profissionalKey == pacientes.payload.val().profissionalResponsavel){
						this.pacientes.push({'pacienteKey': pacientes.key,
					'nome': pacientes.payload.val().nome,
					'sobrenome': pacientes.payload.val().sobrenome,
					'box': pacientes.payload.val().box,
					'leito': pacientes.payload.val().leito,
					'medicoResponsavel': profissional.profissionalData.nome + ' ' + profissional.profissionalData.sobrenome});
					}
				})
				
			});
		});
	}

	private getNomeMedicoResponsavel(medicoKey: string){
		this.profissionais.forEach(data =>{
			if(data.profissionalKey == medicoKey){
				console.log("entrei aqi" + data.profissionalData.nome);
				return data.profissionalData.nome;
			}
		});
	}

	ngOnDestroy(){
		this.pacientesSubscription.unsubscribe();
		this.profissionaisSubscription.unsubscribe();
	}

	liClicked(item){
		console.log(item);
	}
}