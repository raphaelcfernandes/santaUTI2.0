import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RouterOutlet} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {DatabaseService} from '../providers/database.service';

@Component({
	selector: 'app-ficha',
	templateUrl: './ficha.component.html',
	styleUrls: ['./ficha.component.css']
})
export class FichaComponent implements OnInit {
	private fichaObject: any = [];
	private bombaInfusao: any[] = [];
	private hemodinamicoString: string = "";
	private abdomeString: string = "";
	constructor(private router: Router, private activatedRouter: ActivatedRoute, private db: DatabaseService) {
		this.fichaObject = this.db.getFichaObject();
		console.log(this.fichaObject);
	}

	ngOnInit() {
		this.prepareHemodinamicoString();
		this.prepareAbdomeString();

	}

	sendToHome() {
		this.router.navigate(['/home']);
	}

	private prepareHemodinamicoString(): void {
		this.hemodinamicamente();
		this.addBombaInfusaoItens();
		this.pulsoEBulhas();
		this.sopro();
		this.itensMonitorMultiparametrico();
	}

	private hemodinamicamente() { this.hemodinamicoString = "Paciente hemodinamicamente " + this.fichaObject.FolhasBalanco.hemodinamicamente.toLowerCase() +'.'; }

	private addBombaInfusaoItens(){
		if(this.fichaObject.BombaInfusao!==undefined){
			this.hemodinamicoString+=" Em uso de ";	
			for (const key in this.fichaObject.BombaInfusao) {
				this.hemodinamicoString +=  key + ' ' + this.fichaObject.BombaInfusao[key] + ' ml/h, ';
			}
		}
	}

	private pulsoEBulhas(){
		this.hemodinamicoString = this.hemodinamicoString.substr(0,this.hemodinamicoString.length-2) 
		+ '. Pulso '+ this.fichaObject.Hemodinamico.pulso.toLowerCase() + ', bulhas ' + this.fichaObject.Hemodinamico.foneseBulhas.toLowerCase() + ', ';
	}
	
	private sopro(){
		if(this.fichaObject.Hemodinamico.sopro!==false){
			this.hemodinamicoString += 'sopro '
			for(const key in this.fichaObject.Hemodinamico.sopro){
				if(key === 'intensidadeSopro')
					this.hemodinamicoString += this.hemodinamicoString.slice(this.hemodinamicoString.length-5,this.hemodinamicoString.length-1) 
				+ ' intensidade +' + this.fichaObject.Hemodinamico.sopro[key]+ '.';
				else
					this.hemodinamicoString += key+', ';
			}
		}
		else
			this.hemodinamicoString += 'sem sopros';
	}
	
	private itensMonitorMultiparametrico(){
		this.hemodinamicoString += ' Perfusão capilar ' + this.fichaObject.Hemodinamico.perfusaoCapilar.toLowerCase() + ', extremidades '
		+ this.fichaObject.Hemodinamico.extremidadesColoracao.toLowerCase() + ', ' + this.fichaObject.Hemodinamico.extremidadesTemperatura.toLowerCase() 
		+ ', PAM ' + this.fichaObject.MonitorMultiparametrico.PAM + ', PVC ' + this.fichaObject.MonitorMultiparametrico.pvc + ', swan-ganz '
		+ this.fichaObject.MonitorMultiparametrico.swanGanz + ', frequência cardíaca ' + this.fichaObject.MonitorMultiparametrico.frequenciaCardiaca + '.';
	}

	private prepareAbdomeString(){
		this.abdome();
	}

	private abdome(): void{
		this.abdomeString = 'Abdome ' + this.fichaObject.Gastrointestinal.formato.toLowerCase();
	}

// ABDOME
//     abdome: formatos (opcoes), tensao (opcoes), ruidos hidraereos: aumentado/normal/reduzido/ausente.
//     SE NAO TIVER ASCITE: nao precisa escrever
//     SE TIVER ASCITE: escrever tipo ascite pequeno/medio/grande + volume
//     SE NAO TIVER MASSAS: sem massas palpaveis
//     SE TIVER: descrever locais marcados
//     SE NAO TIVER VISCERAS: sem visceras palpaveis
//     SE TIVER: locais marcados.
//     OSTOMIAS: opcoes bom/regular/mal aspecto funcionante ou nao funcionante.
//     SE N MARCAR EVACUACOES: nao evacuou
//     SE TIVER: tipo + quantidade.
}

