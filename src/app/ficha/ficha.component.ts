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

	private hemodinamicamente() { 
		this.hemodinamicoString = "Paciente hemodinamicamente " + this.fichaObject.FolhasBalanco.hemodinamicamente.toLowerCase() +' compensado em ritmo de ' 
		+ this.fichaObject.MonitorMultiparametrico.ritmo.toLowerCase() +'.'; 
	}

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
		this.ascite();
		this.massasPalpaveis();
		this.ostomias();
		this.evacuacoes();
	}

	private abdome(): void{
		this.abdomeString = 'Abdome ' + this.fichaObject.Gastrointestinal.formato.toLowerCase() 
		+ ', ' + this.fichaObject.Gastrointestinal.tensao.toLowerCase() + ', com ruidos ' + this.fichaObject.Gastrointestinal.ruidos.toLowerCase()
		+ '. ';
	}

	private ascite(): void{
		if(this.fichaObject.Gastrointestinal.ascite !== "Ausente")
			this.abdomeString += 'Ascite ' + this.fichaObject.Gastrointestinal.ascite.toLowerCase() + '. ';
	}

	private massasPalpaveis(): void{
		if(this.fichaObject.Gastrointestinal.massasPalpaveis !== false){
			this.abdomeString+= 'Massas palpáveis ';
			for(const key in this.fichaObject.Gastrointestinal.massasPalpaveis)
				this.abdomeString += key.toLowerCase() + ', ';
			this.abdomeString = this.abdomeString.substr(0,this.abdomeString.length-2) + '. ';
		}
		else
			this.abdomeString += 'Sem massas palpáveis. ';
		
	}

	private viscerasPalpaveis(): void {
		if(this.fichaObject.Gastrointestinal.viscerasPalpaveis !== false){
			this.abdomeString += 'Visceras palpáveis ';
			for(const key in this.fichaObject.Gastrointestinal.viscerasPalpaveis)
				this.abdomeString += key.toLowerCase() + ', ';
			this.abdomeString = this.abdomeString.substr(0,this.abdomeString.length-2) + '. ';
		}
		else
			this.abdomeString += 'Sem visceras palpáveis. ';
	}

	private ostomias(): void{
		if(this.fichaObject.Gastrointestinal.ostomias !== false){
			this.abdomeString += 'Ostomias '
			for(const key in this.fichaObject.Gastrointestinal.ostomias){
				this.abdomeString+= key.toLowerCase() + ' ' + this.fichaObject.Gastrointestinal.ostomias[key].qualidade.toLowerCase()
				 + ' ' + this.fichaObject.Gastrointestinal.ostomias[key].funcionamento.toLowerCase() + ', ';
			}
			this.abdomeString = this.abdomeString.substr(0,this.abdomeString.length-2) + '. ';
		}
		else{
			this.abdomeString += 'Sem ostomias. ';
		}
	}

	private evacuacoes(): void {
		if(this.fichaObject.FolhasBalanco.evacuacoes !== false){
			this.abdomeString += 'Evacuacões ';
			for(const key in this.fichaObject.FolhasBalanco.evacuacoes)
				this.abdomeString += key.toLowerCase() + ' ' + this.fichaObject.FolhasBalanco.evacuacoes[key] + ' vezes, ';
			this.abdomeString = this.abdomeString.substr(0,this.abdomeString.length-2) + '. ';
		}
		else
			this.abdomeString += 'Não evacuou.';
	}
}

export enum bombaDVA { 
	adrenalina = "Adrenalina",
	amiodarona = "Amiodarona",
	dobutamina = "Dobutamina",
	dopamina = "Dopamina",
	hidrocortisona = "Hidrocortisona",
	miorinona = "Miorinona",
	nitroglicerina = "Nitroglicerina",
	nitroprussiatodesódio = "Nitroprussiato de sódio"

};

export enum bombaSeda {
	fentanil = "Fentanil",
	ketamina = "Ketamina",
	midazolan = "Midazolan",
	precedex = "Precedex"
}

