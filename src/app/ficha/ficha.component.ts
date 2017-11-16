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
    private hemodinamicoString = '';
    private abdomeString = '';
    private osteomuscularString = '';
    private peleMucosasString = '';
    private nutricionalString = '';
    private infecciosoString = '';
    private endocrinoString =  '';
    private neurologicoString = '';
    private respiratorioString = '';
    private renalString = '';
    private hematologicoString = '';

    constructor(private router: Router, private activatedRouter: ActivatedRoute, private db: DatabaseService) {
        this.fichaObject = this.db.getFichaObject();
        console.log(this.fichaObject);
    }

    ngOnInit() {
        this.prepareHemodinamicoString();
        this.prepareAbdomeString();
        this.prepareOsteomuscularString();
        this.preparePeleMucosasString();
        this.prepareNutricionalString();
        this.prepareInfecciosoString();
        this.prepareEndocrinoString();
        this.prepareNeurologicoString();
        this.prepareRespiratorioString();
        this.prepareRenalString();
        this.prepareHematologicoString();
    }

    private prepareHematologicoString(): void {
        if (this.fichaObject.Hematologico.tromboprofilaxia === 'Não') {
            this.hematologicoString += 'Não realizada.';
        } else {
            this.hematologicoString += this.fichaObject.Hematologico.tromboprofilaxia.toLowerCase();
        }
    }

    private prepareRenalString(): void {
        this.renalString +=
            'Diurese ' + this.fichaObject.FolhasBalanco.diurese + ', balanço hídrico ' + this.fichaObject.FolhasBalanco.balancoHidrico
        + ', peso ' + this.fichaObject.Renal.peso;
        if (this.fichaObject.Exames.ureia !== 0) {
            this.renalString += ', ureia ' + this.fichaObject.Exames.ureia;
        }
        if (this.fichaObject.Exames.creatinina !== 0) {
            this.renalString += ', creatinina ' + this.fichaObject.Exanes.creatinina;
        }
        this.renalString +=
            ', urina ' + this.fichaObject.Renal.urina.toLowerCase() + ', ' + this.fichaObject.Metabolico.hidratacao.toLowerCase();
        if (this.fichaObject.Renal.emDialise !== false) {
            this.renalString += '. Em hemodiálise ';
            if (this.fichaObject.Renal.emDialise.UF === false) {
                this.renalString += 'sem UF.';
            } else {
                this.renalString += 'com UF de volume ' + this.fichaObject.Renal.emDialise.volume
            + ', ' + this.fichaObject.Renal.emDialise.tempo + ' tempo/hora.';
            }
        }
    }

    private prepareRespiratorioString(): void {
        this.viasAereas();
        this.ventilacaoMecanica();
        this.murmurioVesicular();
        this.roncos();
        this.sibilos();
        this.crepitacoes();
        this.respiratorioMonitorMultiparametrico();
        this.raioxTorax();
    }

    private viasAereas(): void {
        if (this.fichaObject.Respiratorio.viasAereas === 'Natural') {
            this.respiratorioString += 'Paciente em ventilação ' + this.fichaObject.Respiratorio.viasAereas.toLowerCase() + ' ';
            if (this.fichaObject.Respiratorio.UsoOxigenio === 'Não') {
                this.respiratorioString += 'sem oxigênio suplementar.';
            } else {
                Object.keys(this.fichaObject.Respiratorio.UsoOxigenio).forEach(item => {
                    if (item === 'Em Máscara de Venturi') {
                        this.respiratorioString += item.toLowerCase() + ' à ' + this.fichaObject.Respiratorio.UsoOxigenio[item] + '%.';
                    }
                    if (item === 'Sob Cateter Nasal' || item === 'Em Máscara de Reinalação') {
                        this.respiratorioString +=
                            item.toLowerCase() + ' com fluxo de ' + this.fichaObject.Respiratorio.UsoOxigenio[item] + ' L/min.';
                    }
                });
            }
        } else {
            Object.keys(this.fichaObject.Respiratorio.ViasAereas).forEach(item => {
                if (item === 'Tubo Traqueal') {
                    this.respiratorioString += 'Paciente entubado (pressão do CUFF ' + this.fichaObject.Respiratorio.ViasAereas.pressaoCuff
                    + ', canula na posição ' + this.fichaObject.Respiratorio.ViasAereas.localizacaoCanula.toLowerCase() + ').';
                }
                if (item === 'Traqueostomia') {
                    this.respiratorioString +=
                        'Paciente traqueostomizado (pressão do CUFF ' + this.fichaObject.Respiratorio.ViasAereas.pressaoCuff + ').';
                }
            });
        }
    }

    private ventilacaoMecanica(): void {
        if (this.fichaObject.Respirador.ventilacaoMecanica === false) {
            this.respiratorioString += ' Não faz uso de ventilação mecânica. ';
        } else {
            this.respiratorioString += ' Em ventilação mecânica (';
            if (this.fichaObject.Respirador.modoVentilatorio === 'Mecânica') {
                this.respiratorioString +=  this.fichaObject.Respirador.parametros + ', FIO2 ' + this.fichaObject.Respirador.fio2
                + ', PEEP ' + this.fichaObject.Respirador.peep + ', VOLUME ' + this.fichaObject.Respirador.volume
                + ', F.R Respirador ' + this.fichaObject.Respirador.freqRespiratoriaRespirador
                + ', F.R Paciente ' + this.fichaObject.Respirador.freqRespiratoriaPaciente + '). ';
            } else if (this.fichaObject.Respirador.modoVentilatorio === 'BIPAP') {
                this.respiratorioString += this.fichaObject.Respirador.modoVentilatorio + ', EPAP ' + this.fichaObject.Respirador.epap
                + ', IPAP ' + this.fichaObject.Respirador.ipap + ', VOLUME ' + this.fichaObject.Respirador.volume
                + ', saturação ' + this.fichaObject.Respirador.saturacao
                + ', oxigênio ' + this.fichaObject.Respirador.oxigenio + '). ';
            } else if (this.fichaObject.Respirador.modoVentilatorio === 'Não-invasiva') {
                this.respiratorioString += this.fichaObject.Respirador.modoVentilatorio + ', FIO2 ' + this.fichaObject.Respirador.fio2
                + ', PEEP ' + this.fichaObject.Respirador.peep + ', VOLUME ' + this.fichaObject.Respirador.volume
                + ', F.R Respirador ' + this.fichaObject.Respirador.freqRespiratoriaRespirador
                + ', F.R Paciente ' + this.fichaObject.Respirador.freqRespiratoriaPaciente + '). ';
            }
        }
    }

    private murmurioVesicular(): void {
        this.respiratorioString += 'Murmúrio vesicular ';
        if (this.fichaObject.Respiratorio.MurmurioVesicular === 'Fisiológico') {
            this.respiratorioString += this.fichaObject.Respiratorio.MurmurioVesicular.toLowerCase() + '. ';
        } else {
            Object.keys(this.fichaObject.Respiratorio.MurmurioVesicular).forEach(item => {
                this.respiratorioString += item.toLowerCase() + ', ';
                Object.keys(this.fichaObject.Respiratorio.MurmurioVesicular[item]).map(res => {
                    this.respiratorioString += res.toLowerCase() + ', ';
                });
            });
            this.respiratorioString = this.respiratorioString.substr(0, this.respiratorioString.length - 2) + '. ';
        }
    }

    private roncos(): void {
        if (this.fichaObject.Respiratorio.Roncos === undefined) {
            this.respiratorioString += 'Sem roncos. ';
        } else {
            this.respiratorioString += 'Roncos ';
            Object.keys(this.fichaObject.Respiratorio.Roncos).forEach(item => {
                this.respiratorioString += item.toLowerCase() + ', ';
            });
            this.respiratorioString = this.respiratorioString.substr(0, this.respiratorioString.length - 2) + '. ';
        }
    }

    private sibilos(): void {
        if (this.fichaObject.Respiratorio.Roncos === undefined) {
            this.respiratorioString += 'Sem sibilos. ';
        } else {
            this.respiratorioString += 'Sibilos ';
            Object.keys(this.fichaObject.Respiratorio.Sibilos).forEach(item => {
                this.respiratorioString += item.toLowerCase() + ', ';
            });
            this.respiratorioString = this.respiratorioString.substr(0, this.respiratorioString.length - 2) + '. ';
        }
    }

    private crepitacoes(): void {
        if (this.fichaObject.Respiratorio.Crepitacoes === undefined) {
            this.respiratorioString += 'Sem crepitações. ';
        } else {
            this.respiratorioString += 'Crepitações ';
            Object.keys(this.fichaObject.Respiratorio.Crepitacoes).forEach(item => {
                this.respiratorioString += item.toLowerCase() + ', ';
            });
            this.respiratorioString = this.respiratorioString.substr(0, this.respiratorioString.length - 2) + '. ';
        }
    }

    private respiratorioMonitorMultiparametrico(): void {
        this.respiratorioString += 'FR ' + this.fichaObject.MonitorMultiparametrico.frequenciaRespiratoria
        +  ', saturando SPO2 ' + this.fichaObject.MonitorMultiparametrico.spo2 + '%. ';
    }

    private raioxTorax(): void {
        if (this.fichaObject.Exames.raioxTorax === 'Não realizou/sem resultados' ||
            this.fichaObject.Exames === undefined || this.fichaObject.Exames.raioxTorax === undefined) {
        } else if (this.fichaObject.Exames.raioxTorax !== 'Normal') {
            this.respiratorioString += 'Raio-X torax ' + this.fichaObject.Exames.raioxTorax.diagnosticoRaiox.toLowerCase() + ' ';
            Object.keys(this.fichaObject.Exames.raioxTorax).forEach(item => {
                if (item !== 'diagnosticoRaiox') {
                    this.respiratorioString += item.toLowerCase() + ', ';
                }
            });
            this.respiratorioString = this.respiratorioString.substr(0, this.respiratorioString.length - 2) + '. ';
        } else {
            this.respiratorioString += 'Raio-X torax normal.';
        }
    }



    private prepareNeurologicoString(): void {
        this.nivelConsciencia();
        this.escalaGlasgow();
        this.orientacaoTemporoEspacial();
        this.deficitMotor();
        this.avaliacaoPupilar();
        this.delirium();
        this.neurologicoMonitorMultiparametrico();
        this.addBombaInfusaoNeurologico();
    }

    private nivelConsciencia(): void {
        this.neurologicoString += 'Paciente ' + this.fichaObject.Neurologico.nivelConsciencia.toLowerCase();
    }

    private escalaGlasgow(): void {
        const total = this.fichaObject.Neurologico.abertaOcular +
        this.fichaObject.Neurologico.respostaMotora + this.fichaObject.Neurologico.respostaVerbal;
        this.neurologicoString += '. Glasgow ' + total + ' (AO: ' + this.fichaObject.Neurologico.abertaOcular +
        ', RV: ' + this.fichaObject.Neurologico.respostaVerbal + ', RM: ' + this.fichaObject.Neurologico.respostaMotora + '), ';
    }

    private orientacaoTemporoEspacial(): void {
        Object.keys(this.fichaObject.Neurologico).forEach(res => {
            if (res === 'No Espaço' || res === 'No Tempo') {
                this.neurologicoString += this.fichaObject.Neurologico[res] + ' ' + res.toLowerCase() + ', ';
            }
        });
        this.neurologicoString = this.neurologicoString.substr(0, this.neurologicoString.length - 2)  + '. ';
    }

    private deficitMotor(): void {
        if (this.fichaObject.Neurologico.mid === undefined
            && this.fichaObject.Neurologico.mie === undefined
            && this.fichaObject.Neurologico.msd === undefined
            && this.fichaObject.Neurologico.mse === undefined) {
            this.neurologicoString += 'Sem déficit motor';
        } else {
            if (this.fichaObject.Neurologico.mid !== undefined) {
                if (this.fichaObject.Neurologico.mid === 'Paresia') {
                    this.neurologicoString += 'M parético inferior direito, ';
                } else {
                    this.neurologicoString += 'M plégico inferior direito, ';
                }
            }
            if (this.fichaObject.Neurologico.msd !== undefined) {
                if (this.fichaObject.Neurologico.msd === 'Paresia') {
                    this.neurologicoString += 'M parético superior direito, ';
                } else {
                    this.neurologicoString += 'M plégico superior direito, ';
                }
            }
            if (this.fichaObject.Neurologico.mie !== undefined) {
                if (this.fichaObject.Neurologico.mie === 'Paresia') {
                    this.neurologicoString += 'M parético inferior esquerdo, ';
                } else {
                    this.neurologicoString += 'M plégico inferior esquerdo, ';
                }
            }
            if (this.fichaObject.Neurologico.mse !== undefined) {
                if (this.fichaObject.Neurologico.mie === 'Paresia') {
                    this.neurologicoString += 'M parético superior esquerdo, ';
                } else {
                    this.neurologicoString += 'M plégico superior esquerdo, ';
                }
            }
            this.neurologicoString = this.neurologicoString.substr(0, this.neurologicoString.length - 2)  + '. ';
        }
    }

    private avaliacaoPupilar(): void {
        this.neurologicoString += 'Pupilas ' + this.fichaObject.Neurologico.tamanhoPupila.toLowerCase() + ', '
        + this.fichaObject.Neurologico.simetriaPupila.toLowerCase() + ', ';
        if (this.fichaObject.Neurologico.simetriaPupilar === 'Anisocóricas') {
            this.fichaObject += this.fichaObject.Neurologico.diferencaPupila.toLowerCase() + ', ';
        }
        this.neurologicoString += this.fichaObject.Neurologico.reatividadeLuzPupila.toLowerCase() + '. ';
    }

    private delirium(): void {
        if (this.fichaObject.Neurologico.deliriumCAMICU === 'Não há delirium') {
            this.neurologicoString += 'Realizado CAM-ICU com ausência de delirium. ';
        } else {
            this.neurologicoString += 'Realizado CAM-ICU com presença de delirium hiperativo. ';
        }
    }

    private addBombaInfusaoNeurologico(): void {
        let flag = false;
        if (this.fichaObject.BombaInfusao !== undefined) {
            Object.keys(bombaSeda).forEach(item => {
                Object.keys(this.fichaObject.BombaInfusao).map(res => {
                    if (res === bombaSeda[item]) {
                        if (!flag) {
                            this.neurologicoString += 'Em uso de ';
                            flag = true;
                        }
                        this.neurologicoString += res + ' ' + this.fichaObject.BombaInfusao[res] + ' ml/h, ';
                    }
                });
            });
            this.neurologicoString = this.neurologicoString.substr(0, this.neurologicoString.length - 2) + '. ';
        }
    }

    private neurologicoMonitorMultiparametrico(): void {
        this.neurologicoString += 'PIC ' + this.fichaObject.MonitorMultiparametrico.pic
        + ', PPC ' + this.fichaObject.MonitorMultiparametrico.ppc + ', capnometria ' + this.fichaObject.MonitorMultiparametrico.capnometria
        + ', SJO2 ' + this.fichaObject.MonitorMultiparametrico.sjo2 + '. ';
    }

    sendToHome() {
        this.router.navigate(['/home']);
    }

    private prepareHemodinamicoString(): void {
        this.hemodinamicamente();
        this.bulhas();
        this.sopro();
        this.pulso();
        this.itensMonitorMultiparametrico();
        this.addBombaInfusaoItens();
    }

    private hemodinamicamente() {
        if (this.fichaObject && this.fichaObject.FolhasBalanco && this.fichaObject.MonitorMultiparametrico) {
            this.hemodinamicoString =
                'Paciente hemodinamicamente ' +
                this.fichaObject.FolhasBalanco.hemodinamicamente.toLowerCase() +
                ' compensado em ritmo ' +
                this.fichaObject.MonitorMultiparametrico.ritmo.toLowerCase() +
                ', FC ' +
                this.fichaObject.MonitorMultiparametrico.frequenciaCardiaca ;
        }
    }

    private addBombaInfusaoItens() {
        if (this.fichaObject.BombaInfusao !== undefined) {
            this.hemodinamicoString += ' Em uso de ';
            Object.keys(bombaDVA).map(item => {
                Object.keys(this.fichaObject.BombaInfusao).map(res => {
                    if (res === bombaDVA[item]) {
                        this.hemodinamicoString +=  res + ' ' + this.fichaObject.BombaInfusao[res] + ' ml/h, ';
                    }
                });
            });
            this.hemodinamicoString = this.hemodinamicoString.substr(0, this.hemodinamicoString.length - 2) + '. ';
        } else {
            this.hemodinamicoString += ' Sem drogas vasoativas. ';
        }
    }

    private bulhas() {
        this.hemodinamicoString += ', bulhas ' + this.fichaObject.Hemodinamico.foneseBulhas.toLowerCase() + ', ';
    }

    private pulso() {
        this.hemodinamicoString += ', pulso ' + this.fichaObject.Hemodinamico.pulso.toLowerCase();
    }

    private sopro() {
        if (this.fichaObject.Hemodinamico.sopro !== false) {
            this.hemodinamicoString += 'sopro ';
            for (const key in this.fichaObject.Hemodinamico.sopro) {
                if (key === 'intensidadeSopro') {
                    this.hemodinamicoString +=
                        this.hemodinamicoString.slice(this.hemodinamicoString.length - 5, this.hemodinamicoString.length - 1) +
                        ' intensidade + ' + this.fichaObject.Hemodinamico.sopro[key] + '.';
                } else {
                    this.hemodinamicoString += key + ', ';
                }
            }
        } else {
            this.hemodinamicoString += 'sem sopros';
        }
    }

    private itensMonitorMultiparametrico() {
        this.hemodinamicoString += ', extremidades '
        + this.fichaObject.Hemodinamico.extremidadesColoracao.toLowerCase()
        + ' e '
        + this.fichaObject.Hemodinamico.extremidadesTemperatura.toLowerCase()
        + ', perfusão capilar '
        + this.fichaObject.Hemodinamico.perfusaoCapilar.toLowerCase()
        + ', PAM '
        + this.fichaObject.MonitorMultiparametrico.pam
        + ', PVC '
        + this.fichaObject.MonitorMultiparametrico.pvc
        + ', Swan-Ganz '
        + this.fichaObject.MonitorMultiparametrico.swanGanz
        + '.';
    }

    private prepareAbdomeString() {
        this.abdome();
        this.ascite();
        this.massasPalpaveis();
        this.ostomias();
        this.evacuacoes();
    }

    private abdome(): void {
        this.abdomeString = 'Abdome ' + this.fichaObject.Gastrointestinal.formato.toLowerCase()
        + ', '
        + this.fichaObject.Gastrointestinal.tensao.toLowerCase() + ', com ruidos ' + this.fichaObject.Gastrointestinal.ruidos.toLowerCase()
        + '. ';
    }

    private ascite(): void {
        if (this.fichaObject.Gastrointestinal.ascite !== 'Ausente') {
            this.abdomeString += 'Ascite ' + this.fichaObject.Gastrointestinal.ascite.toLowerCase() + '. ';
        }
    }

    private massasPalpaveis(): void {
        if (this.fichaObject.Gastrointestinal.massasPalpaveis !== false) {
            this.abdomeString += 'Massas palpáveis ';
            for (const key in this.fichaObject.Gastrointestinal.massasPalpaveis) {
                this.abdomeString += key.toLowerCase() + ', ';
            }
            this.abdomeString = this.abdomeString.substr(0, this.abdomeString.length - 2)  + '. ';
        } else {
            this.abdomeString += 'Sem massas palpáveis. ';
        }
    }

    private viscerasPalpaveis(): void {
        if (this.fichaObject.Gastrointestinal.viscerasPalpaveis !== false) {
            this.abdomeString += 'Visceras palpáveis ';
            for (const key in this.fichaObject.Gastrointestinal.viscerasPalpaveis) {
                this.abdomeString += key.toLowerCase() + ', ';
            }
            this.abdomeString = this.abdomeString.substr(0, this.abdomeString.length - 2)  + '. ';
        } else {
            this.abdomeString += 'Sem visceras palpáveis. ';
        }
    }

    private ostomias(): void {
        if (this.fichaObject.Gastrointestinal.ostomias !== false) {
            for (const key in this.fichaObject.Gastrointestinal.ostomias) {
                this.abdomeString += key.toLowerCase()
                + ' aspecto '
                + this.fichaObject.Gastrointestinal.ostomias[key].qualidade.toLowerCase()
                + ' ' + this.fichaObject.Gastrointestinal.ostomias[key].funcionamento.toLowerCase() + ', ';
            }
            this.abdomeString = this.abdomeString.substr(0, this.abdomeString.length - 2)  + '. ';
        } else {
            this.abdomeString += 'Sem ostomias. ';
        }
    }

    private evacuacoes(): void {
        if (this.fichaObject.FolhasBalanco.evacuacoes !== false) {
            this.abdomeString += 'Evacuacões ';
            for (const key in this.fichaObject.FolhasBalanco.evacuacoes) {
                this.abdomeString += key.toLowerCase() + ' ' + this.fichaObject.FolhasBalanco.evacuacoes[key] + ' vezes, ';
            }
            this.abdomeString = this.abdomeString.substr(0, this.abdomeString.length - 2)  + '. ';
        } else {
            this.abdomeString += 'Não evacuou.';
        }
    }

    private prepareOsteomuscularString(): void {
        this.osteomuscularString += 'Musculatura ' + (this.fichaObject.Osteomuscular.trofismoMuscular
            .substr(0, this.fichaObject.Osteomuscular.trofismoMuscular.length - 1).toLowerCase()) + 'a e '
            + this.fichaObject.Osteomuscular.tonusMuscular.substr(0, this.fichaObject.Osteomuscular.tonusMuscular.length - 1).toLowerCase()
            + 'a.';
    }

    private preparePeleMucosasString(): void {
        this.mucosas();
        this.pele();
    }

    private mucosas(): void {
        this.peleMucosasString += 'Paciente com mucosas ';
        let coloracao1: string;
        let coracao: string;
        let hidratacao: string;
        let ictericia: number;
        for (const key in this.fichaObject.PeleMucosas.Mucosas) {
            if (key === 'Anictéricas' || key === 'Ictéricas') {
                coloracao1 = key;
            }
            if (key === 'Hipocoradas' || key === 'Normocoradas') {
                coracao = key;
            }
            if (key === 'Hidratadas' || key === 'Secas' || key === 'Hiperhidratadas') {
                hidratacao = key;
            }
        }
        if (coloracao1 === 'Ictéricas') {
            ictericia = this.fichaObject.PeleMucosas.ictericia;
            this.peleMucosasString += coloracao1.toLowerCase()
            + ' + ' + ictericia + ', ' + coracao.toLowerCase()
            + ', ' + hidratacao.toLowerCase() + '. ';
        } else {
            this.peleMucosasString += coloracao1.toLowerCase() + ', ' + coracao.toLowerCase() + ', ' + hidratacao.toLowerCase() + '. ';
        }
    }

    private pele(): void {
        this.peleMucosasString += 'Pele ' + this.fichaObject.PeleMucosas.pele.toLowerCase() + ' ';
        if (this.fichaObject.PeleMucosas.UlceraPressao !== undefined) {
            this.peleMucosasString += 'com ulcera de pressão em ';
            for (const key in this.fichaObject.PeleMucosas.UlceraPressao) {
                this.peleMucosasString += key.toLowerCase() + ', ';
            }
            this.peleMucosasString = this.peleMucosasString.substr(0, this.peleMucosasString.length - 2)  + '. ';
        } else {
            this.peleMucosasString += 'sem ulcera de pressão.';
        }
    }

    private prepareNutricionalString(): void {
        this.nutricionalString += 'Paciente em dieta ';
        Object.keys(this.fichaObject.Nutricional).forEach(res => {
            this.nutricionalString += res.toLowerCase() + ' com aceitação ' + this.fichaObject.Nutricional[res].toLowerCase() + ', ';
        });
        this.nutricionalString = this.nutricionalString.substr(0, this.nutricionalString.length - 2)  + '. ';
        if (this.fichaObject.Exames.Albumina !== undefined) {
            this.nutricionalString += 'Albumina ' + this.fichaObject.Exames.Albumina.toLowerCase() + '. ';
        }
        this.nutricionalString += 'Peso ' + this.fichaObject.Renal.peso + ' kg. ';
    }

    private prepareInfecciosoString(): void {
        this.infecciosoString += 'Curva térmica ';
        if (this.fichaObject.FolhasBalanco.curvaTermica >= 40) {
            this.infecciosoString += 'hipertermica ';
        } else if (this.fichaObject.FolhasBalanco.curvaTermica >= 36.5 && this.fichaObject.FolhasBalanco.curvaTermica <= 37.6) {
            this.infecciosoString += 'normal ';
        } else if (this.fichaObject.FolhasBalanco.curvaTermica > 36 && this.fichaObject.FolhasBalanco.curvaTermica <= 38) {
            this.infecciosoString += 'subfebril ';
        } else if (this.fichaObject.FolhasBalanco.curvaTermica < 35) {
            this.infecciosoString += 'hiportérmica ';
        }
        if (this.fichaObject.FolhasBalanco.picosFebris !== undefined) {
            if (this.fichaObject.FolhasBalanco.picosFebris > 1) {
                this.infecciosoString += 'com ' + this.fichaObject.FolhasBalanco.picosFebris + ' picos febris. ';
            } else {
                this.infecciosoString += 'com ' + this.fichaObject.FolhasBalanco.picosFebris + ' pico febril. ';
            }
        }
        if (this.fichaObject.Exames.marcadoresInfeccao !== undefined) {
            this.infecciosoString += 'Marcadores de infecção ' + this.fichaObject.Exames.marcadoresInfeccao.toLowerCase() + '. ';
        }
        if (this.fichaObject.Infeccioso !== undefined) {
            this.infecciosoString += 'Em uso de ';
            this.fichaObject.Infeccioso.forEach(item => {
                this.infecciosoString += item + ', ';
            });
            this.infecciosoString = this.infecciosoString.substr(0, this.infecciosoString.length - 2) + '. ';
        }
    }

    private prepareEndocrinoString(): void {
        this.endocrinoString += 'Paciente com ' + this.fichaObject.Endocrino.curvaGlicemica.toLowerCase() + '. ';
        if (this.fichaObject.BombaInfusao !== undefined) {
            Object.keys(bombaEndocrino).forEach(item => {
                Object.keys(this.fichaObject.BombaInfusao).map(res => {
                    if (res === bombaEndocrino[item]) {
                        this.endocrinoString += 'Em uso de ' +  res + ' em bomba de infusão, ';
                    }
                });
            });
            this.endocrinoString = this.endocrinoString.substr(0, this.endocrinoString.length - 2)  + '. ';
        }
    }
}

export enum bombaDVA {
    adrenalina = 'Adrenalina',
    amiodarona = 'Amiodarona',
    dobutamina = 'Dobutamina',
    dopamina = 'Dopamina',
    hidrocortisona = 'Hidrocortisona',
    miorinona = 'Miorinona',
    nitroglicerina = 'Nitroglicerina',
    nitroprussiatodesódio = 'Nitroprussiato de sódio'
}

export enum bombaSeda {
    fentanil = 'Fentanil',
    ketamina = 'Ketamina',
    midazolan = 'Midazolan',
    precedex = 'Precedex'
}

export enum bombaEndocrino {
    insulina = 'Insulina'
}

