import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DatabaseService } from '../providers/database.service';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'app-ficha',
    templateUrl: './ficha.component.html',
    styleUrls: ['./ficha.component.css']
})

export class FichaComponent implements OnInit, OnDestroy {
    private fichaObject: any = [];
    private allFichas: any = [];
    private nutricaoArray: any[] = [];
    private hemodinamicoString: string;
    private abdomeString: string;
    private osteomuscularString: string;
    private peleMucosasString: string;
    private nutricionalString: string;
    private infecciosoString: string;
    private endocrinoString: string;
    private neurologicoString: string;
    private respiratorioString: string;
    private metabolicoString: string;
    private renalString: string;
    private hematologicoString: string;
    private subscriptions: Subscription = new Subscription();
    private pesoAcumulado: any;
    private balancoHidricoAcumulado: any;
    private antibioticos: any[] = [];
    private raiox: any = [];
    private diagnosticos: any = [];
    private diagnosticoString: '';
    private comentarioString: '';
    private id = 0;
    private diagnosticoButtonString: string;
    private radioModel: string;
    data: any;
    options = {
        responsive: true,
        maintainAspectRatio: false
    };
    pamData: any;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute, private db: DatabaseService) {
        this.diagnosticoButtonString = 'Mostrar todos';
        this.radioModel = 'todos';
        this.subscriptions.add(this.activatedRoute.params.subscribe((params: Params) => {
            const userId = params['id'];
            this.db.getAllFichasByPacienteKey(userId).snapshotChanges().subscribe(data => {
                data.forEach(ficha => {
                    this.allFichas.push(ficha.payload.val());
                    console.log(this.allFichas)
                });
                this.db.getLastFichaByPacienteKey(userId).snapshotChanges().subscribe(lastFicha => {
                    lastFicha.forEach(last => {
                        this.fichaObject = last.payload.val();
                        this.prepareGraphs();
                        this.fillTextAreas();
                    });
                });
                // this.db.getDiagosnitcosByPacienteKey(userId).snapshotChanges().subscribe(diagnosticos => {
                //     diagnosticos.forEach(diagnostico => {
                //         this.diagnosticos.push(diagnostico.payload.val());
                //     });
                //     this.prepareDiagnosticos();
                // });
            });
            this.subscriptions.unsubscribe();
        }));
    }

    ngOnInit() { }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    filtrar(index, diagnostico) {
        return diagnostico.dataResolvido !== null ? true : false;
    }

    private addDiagnostico() {
        if (this.comentarioString !== '' && this.diagnosticoString !== '') {
            this.diagnosticos.push({
                'diagnostico': this.diagnosticoString,
                'comentario': this.comentarioString,
                'dataDiagnostico': this.convertTimeStampToPrettyDate(new Date().getTime()),
                'id': this.id
            });
            this.diagnosticoString = '';
            this.comentarioString = '';
            this.id++;
        }
    }

    private prepareDiagnosticos(): void {
        this.diagnosticos.forEach(diagnostico => {
            diagnostico.dataDiagnostico = this.convertTimeStampToPrettyDate(diagnostico.dataDiagnostico);
            if (diagnostico.dataResolvido !== undefined) {
                diagnostico.dataResolvido = this.convertTimeStampToPrettyDate(diagnostico.dataResolvido);
            }
        });
    }

    private excluirDiagnostico(diagnostico): void {
        let index: number;
        // Diagnostico recem adicionado
        if (diagnostico.id !== undefined) {
            index = this.diagnosticos.findIndex(item => item.id === diagnostico.id);
            this.diagnosticos.splice(index, 1);
            if (this.id === 0) {
                this.id = 0;
            } else {
                this.id--;
            }
        }
    }

    private resolverDiagnostico(diagnostico): void {
        let index: number;
        // Diagnostico recem adicionado
        index = this.diagnosticos.findIndex(item => item === diagnostico);
        this.diagnosticos[index].dataResolvido = this.convertTimeStampToPrettyDate(new Date().getTime());
        this.diagnosticos[index].resolvido = true;
    }

    private desfazerAcaoDiagnostico(diagnostico): void {
        let index: number;
        // Diagnostico recem adicionado
        index = this.diagnosticos.findIndex(item => item === diagnostico);
        this.diagnosticos[index].dataResolvido = null;
        this.diagnosticos[index].resolvido = false;
    }

    
    private prepareGraphs(): void {
        const pesoDataGraph: any = [];
        const pesoDatesGraph: any = [];
        const pamDataGraph: any = [];
        const pamDatesGraph: any = [];
        const ant: any[] = [];
        let firstDay = Infinity;

        this.allFichas.forEach(data => {
            if (data.dataCriada < firstDay) {
                this.pesoAcumulado = this.fichaObject.Renal.peso - data.Renal.peso;
                this.balancoHidricoAcumulado = this.fichaObject.FolhasBalanco.balancoHidrico - data.FolhasBalanco.balancoHidrico;
                firstDay = data.dataCriada;
            }
        });

        this.allFichas.forEach(data => {
            const date = this.convertTimeStampToPrettyDate(data.dataCriada);
            pamDataGraph.push(data.MonitorMultiparametrico.pam);
            pamDatesGraph.push(date);
            pesoDataGraph.push(data.Renal.peso);
            pesoDatesGraph.push(date);
        });


        // Remove de allFichas a ficha + recente
        this.allFichas.splice(this.allFichas.findIndex(ficha => ficha.dataCriada === this.fichaObject.dataCriada), 1);


        // // Remove as fichas com periodo maior que 24hrs em relaçaoa a ficha + recente
        for (const k in this.allFichas) {
            const date = new Date(this.fichaObject.dataCriada);
            date.setDate(date.getDate() - 1);
            if (this.allFichas[k].dataCriada < this.fichaObject.dataCriada &&
                this.allFichas[k].dataCriada < date) {
                this.allFichas.splice(k, 1);
            }
        }

        this.allFichas.forEach(ficha => {
            for (const k of ficha.Infeccioso) {
                this.antibioticos.push({
                    'nome': k,
                    'data': this.convertTimeStampToPrettyDate(ficha.dataCriada)
                });
            }
        });

        
        this.antibioticos.forEach(a => {
            if (ant.length === 0) {
                ant.push({
                    'data': a.data,
                    'antibioticos': [a.nome]
                });
            } else {
                let flag = false;
                ant.forEach(b => {
                    if (b.data === a.data) {
                        b.antibioticos.push(a.nome);
                        flag = true;
                    }
                });
                if (!flag) {
                    ant.push({
                        'data': a.data,
                        'antibioticos': [a.nome]
                    });
                }

            }
        });

        this.antibioticos = ant;
        
        this.allFichas.forEach(data => {
            data.dataCriada = this.convertTimeStampToPrettyDate(data.dataCriada);
        });

        this.allFichas.forEach(ficha => {
            Object.keys(ficha.FolhasBalanco.nutricao).forEach(key => {
                this.nutricaoArray.push({
                    'dieta': key,
                    'valor': ficha.FolhasBalanco.nutricao[key],
                    'data': ficha.dataCriada
                });
            });
        });

        this.pamData = {
            labels: pesoDatesGraph,
            datasets: [
                {
                    label: 'Histórico pesagem',
                    data: pesoDataGraph,
                    fill: false,
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        };
        this.data = {
            labels: pamDatesGraph,
            datasets: [
                {
                    label: 'Histórico PAM',
                    data: pamDataGraph,
                    fill: false,
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        };
    }

    private correctName(name: string) {
        Object.keys(exames).forEach(item => {
            if (item === name) {
                return exames[item];
            }
        });
    }

    private convertTimeStampToPrettyDate(time: any): string {
        let date = new Date(time).getUTCDate() + '/'
            + monthNames[new Date(time).getMonth()] + ' às ';
        new Date(time).getHours() < 10 ? date += '0' + new Date(time).getHours()
            : date += new Date(time).getHours();
        new Date(time).getMinutes() < 10 ? date += ':0' + new Date(time).getMinutes()
            : date += ':' + new Date(time).getMinutes();
        return date;
    }

    private fillTextAreas(): void {
        this.prepareNeurologicoString();
        this.prepareHemodinamicoString();
        this.prepareAbdomeString();
        this.prepareOsteomuscularString();
        this.preparePeleMucosasString();
        this.prepareNutricionalString();
        this.prepareInfecciosoString();
        this.prepareEndocrinoString();
        this.prepareRespiratorioString();
        this.prepareRenalString();
        this.prepareHematologicoString();
        this.prepareMetabolicoString();
    }

    private prepareMetabolicoString(): void {
        this.metabolicoString = '';
        if (this.fichaObject.Exames.calcio !== undefined && this.fichaObject.Exames.calcio !== 'Normal'
            && this.fichaObject.Exames.calcio !== 'Não realizou/sem resultados') {
            this.metabolicoString += this.fichaObject.Exames.calcio;
        }
        if (this.fichaObject.Exames.fosforo !== undefined && this.fichaObject.Exames.fosforo !== 'Normal'
            && this.fichaObject.Exames.fosforo !== 'Não realizou/sem resultados') {
            if (this.metabolicoString !== '') {
                this.metabolicoString += ', ' + this.fichaObject.Exames.fosforo.toLowerCase();
            } else {
                this.metabolicoString += this.fichaObject.Exames.fosforo;
            }
        }
        if (this.fichaObject.Exames.magnesio !== undefined && this.fichaObject.Exames.magnesio !== 'Normal'
            && this.fichaObject.Exames.magnesio !== 'Não realizou/sem resultados') {
            if (this.metabolicoString !== '') {
                this.metabolicoString += ', ' + this.fichaObject.Exames.magnesio.toLowerCase();
            } else {
                this.metabolicoString += this.fichaObject.Exames.magnesio;
            }
        }
        if (this.fichaObject.Exames.potassio !== undefined && this.fichaObject.Exames.potassio !== 'Normal'
            && this.fichaObject.Exames.potassio !== 'Não realizou/sem resultados') {
            if (this.metabolicoString !== '') {
                this.metabolicoString += ', ' + this.fichaObject.Exames.potassio.toLowerCase();
            } else {
                this.metabolicoString += this.fichaObject.Exames.potassio;
            }
            this.metabolicoString += '. ';
        }
        if (this.fichaObject.Exames.gasometriaArterial !== undefined
            && this.fichaObject.Exames.gasometriaArterial !== 'Não realizou/sem resultados'
            && this.fichaObject.Exames.gasometriaArterial !== 'Normal') {
            this.metabolicoString += 'Gasometria arterial ' +
                this.fichaObject.Exames.gasometriaArterial.tipoGasometriaArterial.toLowerCase() + ' ' +
                this.fichaObject.Exames.gasometriaArterial.metabolicaRespiratoria.toLowerCase() + ' ';
            if (this.fichaObject.Exames.gasometriaArterial.metabolicaRespiratoria !== 'Mista') {
                this.metabolicoString += this.fichaObject.Exames.gasometriaArterial.compensadaDescompensada.toLowerCase() + '. ';
            }
        }
    }

    private prepareHematologicoString(): void {
        if (this.fichaObject.Hematologico.tromboprofilaxia === 'Não') {
            this.hematologicoString = 'Não realizada.';
        } else {
            this.hematologicoString = this.fichaObject.Hematologico.tromboprofilaxia + '.';
        }
        if (this.fichaObject.Exames.hematocrito > 0) {
            this.hematologicoString += 'Hematócritos ' + this.fichaObject.Exames.hematocrito + '. ';
        }
        if (this.fichaObject.Exames.hemoglobina > 0) {
            this.hematologicoString += 'Hemoglobina ' + this.fichaObject.Exames.hemoglobina + '. ';
        }
        if (this.fichaObject.Exames.plaquetas > 0) {
            this.hematologicoString += 'Plaquetas ' + this.fichaObject.Exames.plaquetas + '. ';
        }
        if (this.fichaObject.Exames.lactato !== 'Normal'
            && this.fichaObject.Exames.lactato !== undefined
            && this.fichaObject.Exames.lactato !== 'Não realizou/sem resultados') {
            this.hematologicoString += 'Lactato ' + this.fichaObject.Exames.lactato.toLowerCase() + '. ';
        }
    }

    private prepareRenalString(): void {
        this.renalString = 'Diurese ' + this.fichaObject.FolhasBalanco.diurese;
        // if (this.allFichas !== undefined) {
            // this.renalString += ' (' + this.allFichas[0].FolhasBalanco.diurese +
                // ' em ' + this.allFichas[0].dataCriada + ')';
        // }
        this.renalString += ', balanço hídrico '
            + this.fichaObject.FolhasBalanco.balancoHidrico + ' e acumulado de ' + this.balancoHidricoAcumulado + ', peso '
            + this.fichaObject.Renal.peso + 'kg e acumulado de ' + this.pesoAcumulado + 'kg';
        if (this.fichaObject.Exames.ureia !== 0) {
            this.renalString += ', ureia ' + this.fichaObject.Exames.ureia;
        }
        if (this.fichaObject.Exames.creatinina !== 0) {
            this.renalString += ', creatinina ' + this.fichaObject.Exames.creatinina;
            this.renalString += ', urina ' + this.fichaObject.Renal.urina.toLowerCase() + ', '
                + this.fichaObject.Metabolico.hidratacao.toLowerCase();
        }
        if (this.fichaObject.Renal.emDialise !== false) {
            this.renalString += '. Em hemodiálise ';
            if (this.fichaObject.Renal.emDialise.UF === false) {
                this.renalString += 'sem UF.';
            } else {
                this.renalString += 'com UF de volume ' + this.fichaObject.Renal.emDialise.volume
                    + ', ' + this.fichaObject.Renal.emDialise.tempo + ' tempo/hora. ';
            }
        } else {
            this.renalString += '. ';
        }
        if (this.fichaObject.Exames.albumina !== undefined) {
            if (this.fichaObject.Exames.albumina !== 'Normal' ||
                this.fichaObject.Exames.albumina !== 'Não realizou/sem resultados') {
                this.renalString += this.fichaObject.Exames.albumina + '. ';
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
            this.respiratorioString = 'Paciente em ventilação ' + this.fichaObject.Respiratorio.viasAereas.toLowerCase() + ' ';
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
                    this.respiratorioString = 'Paciente entubado (pressão do CUFF ' + this.fichaObject.Respiratorio.ViasAereas.pressaoCuff
                        + ', canula na posição ' + this.fichaObject.Respiratorio.ViasAereas.localizacaoCanula.toLowerCase() + ').';
                }
                if (item === 'Traqueostomia') {
                    this.respiratorioString =
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
                this.respiratorioString += this.fichaObject.Respirador.parametros + ', FIO2 ' + this.fichaObject.Respirador.fio2
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
        if (this.fichaObject.Respiratorio.Sibilos === undefined) {
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
            + ', saturando SPO2 ' + this.fichaObject.MonitorMultiparametrico.spo2 + '%. ';
    }

    private raioxTorax(): void {
        if (this.fichaObject.Exames.raioxTorax === 'Não realizou/sem resultados' ||
            this.fichaObject.Exames === undefined || this.fichaObject.Exames.raioxTorax === undefined) {
        } else if (this.fichaObject.Exames.raioxTorax !== 'Normal') {
            this.respiratorioString += 'Raio-X torax ' + this.fichaObject.Exames.raioxTorax.diagnosticoRaiox.toLowerCase() + ' ';
            Object.keys(this.fichaObject.Exames.raioxTorax).forEach(item => {
                if (item !== 'diagnosticoRaiox') {
                    this.respiratorioString += item.toLowerCase() + ', ';
                    this.raiox.push(item);
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
        this.neurologicoString = 'Paciente ';
        if (this.fichaObject.Neurologico.nivelConsciencia === 'CONSCIENTE/ALERTA') {
            this.neurologicoString += 'consciente/alerta';
        } else if (this.fichaObject.Neurologico.nivelConsciencia === 'VIGIL') {
            this.neurologicoString += 'vigil';
        } else if (this.fichaObject.Neurologico.nivelConsciencia === 'SONOLÊNCIA') {
            this.neurologicoString += 'sonolento';
        } else if (this.fichaObject.Neurologico.nivelConsciencia === 'OBNUBILAÇÃO') {
            this.neurologicoString += 'obnubilado';
        } else if (this.fichaObject.Neurologico.nivelConsciencia === 'TORPOR') {
            this.neurologicoString += 'torporoso';
        } else if (this.fichaObject.Neurologico.nivelConsciencia === 'COMA') {
            this.neurologicoString += 'comatoso';
        } else if (this.fichaObject.Neurologico.nivelConsciencia === 'SEDADO') {
            this.neurologicoString += 'sedado, ramsay ' + this.fichaObject.Neurologico.ramsay
                + ', rass ' + this.fichaObject.Neurologico.rass;
        }
    }

    private escalaGlasgow(): void {
        const total = this.fichaObject.Neurologico.aberturaOcular +
            this.fichaObject.Neurologico.respostaMotora + this.fichaObject.Neurologico.respostaVerbal;
        this.neurologicoString += '. Glasgow ' + total + ' (AO: ' + this.fichaObject.Neurologico.aberturaOcular +
            ', RV: ' + this.fichaObject.Neurologico.respostaVerbal + ', RM: ' + this.fichaObject.Neurologico.respostaMotora + '), ';
    }

    private orientacaoTemporoEspacial(): void {
        Object.keys(this.fichaObject.Neurologico).forEach(res => {
            if (res === 'No Espaço' || res === 'No Tempo') {
                this.neurologicoString += this.fichaObject.Neurologico[res].toLowerCase() + ' ' + res.toLowerCase() + ', ';
            }
        });
        this.neurologicoString = this.neurologicoString.substr(0, this.neurologicoString.length - 2) + '. ';
    }

    private deficitMotor(): void {
        if (this.fichaObject.Neurologico.mid === undefined
            && this.fichaObject.Neurologico.mie === undefined
            && this.fichaObject.Neurologico.msd === undefined
            && this.fichaObject.Neurologico.mse === undefined) {
            this.neurologicoString += 'Sem déficit motor. ';
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
            this.neurologicoString = this.neurologicoString.substr(0, this.neurologicoString.length - 2) + '. ';
        }
    }

    private avaliacaoPupilar(): void {
        this.neurologicoString += 'Pupilas ' + this.fichaObject.Neurologico.tamanhoPupila.toLowerCase() + ', '
            + this.fichaObject.Neurologico.simetriaPupila.toLowerCase() + ', ';
        if (this.fichaObject.Neurologico.simetriaPupilar === 'Anisocóricas') {
            this.fichaObject += this.fichaObject.Neurologico.diferencaPupila.toLowerCase() + ', ';
        }
        this.neurologicoString += this.fichaObject.Neurologico.reatividadeLuzPupila.toLowerCase() + ' à luz. ';
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
            + ', PPC ' + this.fichaObject.MonitorMultiparametrico.ppc + ', capnometria '
            + this.fichaObject.MonitorMultiparametrico.capnometria
            + ', SJO2 ' + this.fichaObject.MonitorMultiparametrico.sjo2 + '. ';
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
            if (this.fichaObject.MonitorMultiparametrico.ritmo === 'Ritmo de Marcapasso') {
                this.hemodinamicoString =
                    'Paciente hemodinamicamente ' +
                    this.fichaObject.FolhasBalanco.hemodinamicamente.toLowerCase() +
                    ' compensado em ' +
                    this.fichaObject.MonitorMultiparametrico.ritmo.toLowerCase() +
                    ', FC ' +
                    this.fichaObject.MonitorMultiparametrico.frequenciaCardiaca;
            } else {
                this.hemodinamicoString =
                    'Paciente hemodinamicamente ' +
                    this.fichaObject.FolhasBalanco.hemodinamicamente.toLowerCase() +
                    ' compensado em ritmo ' +
                    this.fichaObject.MonitorMultiparametrico.ritmo.toLowerCase() +
                    ', FC ' +
                    this.fichaObject.MonitorMultiparametrico.frequenciaCardiaca;
            }
        }
    }

    private addBombaInfusaoItens() {
        if (this.fichaObject.BombaInfusao !== undefined) {
            this.hemodinamicoString += ' Em uso de ';
            Object.keys(bombaDVA).map(item => {
                Object.keys(this.fichaObject.BombaInfusao).map(res => {
                    if (res === bombaDVA[item]) {
                        this.hemodinamicoString += res + ' ' + this.fichaObject.BombaInfusao[res] + ' ml/h, ';
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
        const ficha = this.fichaObject;
        console.log(this.allFichas)
        this.hemodinamicoString += ', extremidades '
            + this.fichaObject.Hemodinamico.extremidadesColoracao.toLowerCase()
            + ' e '
            + this.fichaObject.Hemodinamico.extremidadesTemperatura.toLowerCase()
            + ', perfusão capilar '
            + this.fichaObject.Hemodinamico.perfusaoCapilar.toLowerCase()
            + ', PAM ' + this.fichaObject.MonitorMultiparametrico.pam;
        if (this.allFichas !== undefined) {
            this.hemodinamicoString += ' (' + ficha.MonitorMultiparametrico.pam + ' em ' + ficha.dataCriada + ')';
        }
        this.hemodinamicoString += ', PVC '
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
        this.amilase();
        this.insertExamesIntoAbdome();
        this.ffaGGT();
        this.transaminases();
    }

    private abdome(): void {
        this.abdomeString = 'Abdome ' + this.fichaObject.Gastrointestinal.formato.toLowerCase()
            + ', '
            + this.fichaObject.Gastrointestinal.tensao.toLowerCase() + ', com ruidos '
            + this.fichaObject.Gastrointestinal.ruidos.toLowerCase()
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
            this.abdomeString = this.abdomeString.substr(0, this.abdomeString.length - 2) + '. ';
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
            this.abdomeString = this.abdomeString.substr(0, this.abdomeString.length - 2) + '. ';
        } else {
            this.abdomeString += 'Sem visceras palpáveis. ';
        }
    }

    private ostomias(): void {
        if (this.fichaObject.Gastrointestinal.ostomias !== false) {
            for (const key in this.fichaObject.Gastrointestinal.ostomias) {
                this.abdomeString += key
                    + ' com ' + this.fichaObject.Gastrointestinal.ostomias[key].qualidade.toLowerCase() + ' aspecto'
                    + ' ' + this.fichaObject.Gastrointestinal.ostomias[key].funcionamento.toLowerCase() + ', ';
            }
            this.abdomeString = this.abdomeString.substr(0, this.abdomeString.length - 2) + '. ';
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
            this.abdomeString = this.abdomeString.substr(0, this.abdomeString.length - 2) + '. ';
        } else {
            this.abdomeString += 'Não evacuou.';
        }
    }

    private amilase(): void {
        if (this.fichaObject.Exames.amilase !== undefined) {
            if (this.fichaObject.Exames.amilase === false) {
                this.abdomeString += 'Amilase não dosada. ';
            } else {
                this.abdomeString += 'Amilase ' + this.fichaObject.Exames.amilase.toLowerCase() + '. ';
            }
        }
    }

    private ffaGGT(): void {
        if (this.fichaObject.Exames.funcaoHepaticaFAGGT !== undefined
            && this.fichaObject.Exames.funcaoHepaticaFAGGT === 'Elevadas') {
            this.abdomeString += 'FA/GGT ' + this.fichaObject.Exames.funcaoHepaticaFAGGT.toLowerCase() + '. ';
        }
    }

    private transaminases(): void {
        if (this.fichaObject.Exames.funcaoHepaticaTransaminases !== undefined
            && this.fichaObject.Exames.funcaoHepaticaTransaminases === 'Elevadas') {
            this.abdomeString += 'Transaminases ' + this.fichaObject.Exames.funcaoHepaticaTransaminases.toLowerCase() + '. ';
        }
    }

    private insertExamesIntoAbdome(): void {
        if (this.fichaObject.Exames.funcaoHepaticaBilirrubinas !== undefined
            && this.fichaObject.Exames.funcaoHepaticaBilirrubinas !== 'Não realizou/sem resultados'
            && this.fichaObject.Exames.funcaoHepaticaBilirrubinas !== 'Normais') {
            this.abdomeString += 'Bilirrubinas ' + this.fichaObject.Exames.funcaoHepaticaBilirrubinas.toLowerCase() + '. ';
        }
    }

    private prepareOsteomuscularString(): void {
        this.osteomuscularString = 'Musculatura ' + (this.fichaObject.Osteomuscular.trofismoMuscular
            .substr(0, this.fichaObject.Osteomuscular.trofismoMuscular.length - 1).toLowerCase()) + 'a e '
            + this.fichaObject.Osteomuscular.tonusMuscular.substr(0, this.fichaObject.Osteomuscular.tonusMuscular.length - 1).toLowerCase()
            + 'a.';
    }

    private preparePeleMucosasString(): void {
        this.mucosas();
        this.pele();
    }

    private mucosas(): void {
        this.peleMucosasString = 'Paciente com mucosas ';
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
                + ' + ' + ictericia + ', ' + coloracao1.toLowerCase()
                + ', ' + hidratacao.toLowerCase() + '. ';
        } else {
            // this.peleMucosasString += coloracao1.toLowerCase() + ', ' + coloracao1.toLowerCase() + ', ' + hidratacao.toLowerCase() + '. ';
            this.peleMucosasString+='Arruma essa merda '
        }
    }

    private pele(): void {
        this.peleMucosasString += 'Pele ' + this.fichaObject.PeleMucosas.pele.toLowerCase() + ' ';
        if (this.fichaObject.PeleMucosas.UlceraPressao !== undefined) {
            this.peleMucosasString += 'com ulcera de pressão em ';
            for (const key in this.fichaObject.PeleMucosas.UlceraPressao) {
                this.peleMucosasString += key.toLowerCase() + ', ';
            }
            this.peleMucosasString = this.peleMucosasString.substr(0, this.peleMucosasString.length - 2) + '. ';
        } else {
            this.peleMucosasString += 'sem ulcera de pressão.';
        }
    }

    private prepareNutricionalString(): void {
        this.nutricionalString = 'Paciente em dieta ';
        Object.keys(this.fichaObject.Nutricional).forEach(res => {
            this.nutricionalString += res.toLowerCase() + ' com aceitação ' + this.fichaObject.Nutricional[res].toLowerCase() + ', ';
        });
        this.nutricionalString = this.nutricionalString.substr(0, this.nutricionalString.length - 2);
        // if (this.allFichas !== undefined) {
        //     this.nutricionalString += ' (';
        //     Object.keys(this.fichaObject.FolhasBalanco.nutricao).forEach(res => {
        //         this.nutricionalString += res.toLowerCase() + ' com ' + this.fichaObject.FolhasBalanco.nutricao[res] + ' volume/ml, ';
        //     });
        //     this.nutricionalString = this.nutricionalString.substr(0, this.nutricionalString.length - 2);
        //     this.nutricionalString += ' em ' + this.fichaObject.dataCriada + '). ';

        // } else {
        //     this.nutricionalString += '. ';
        // }
        // if (this.fichaObject.Exames.Albumina !== undefined) {
        //     this.nutricionalString += 'Albumina ' + this.fichaObject.Exames.Albumina.toLowerCase() + '. ';
        // }
        this.nutricionalString += 'Peso atual ' + this.fichaObject.Renal.peso + 'kg e peso acumulado de ' + this.pesoAcumulado + 'kg.';
    }

    private prepareInfecciosoString(): void {

        const ficha = this.fichaObject;
        
        this.infecciosoString = 'Curva térmica ' + this.fichaObject.FolhasBalanco.curvaTermica + ' ';
        if (this.fichaObject.FolhasBalanco.picosFebris !== undefined) {
            if (this.fichaObject.FolhasBalanco.picosFebris > 1) {
                this.infecciosoString += 'com ' + this.fichaObject.FolhasBalanco.picosFebris + ' picos febris ';
            } else {
                this.infecciosoString += 'com ' + this.fichaObject.FolhasBalanco.picosFebris + ' pico febril ';
            }
        }
        if (ficha !== undefined) {
            this.infecciosoString += '(' + ficha.FolhasBalanco.curvaTermica + ' em ' + ficha.dataCriada + '). ';
        } else {
            this.infecciosoString += '. ';
        }
        if (this.fichaObject.Exames.pcr !== undefined && this.fichaObject.Exames.pcr !== 'Não realizou/sem resultados') {
            this.infecciosoString += 'PCR ' + this.fichaObject.Exames.pcr + ', ';
        }
        if (this.fichaObject.Exames.leucograma !== undefined && this.fichaObject.Exames.leucograma !== 'Não realizou/sem resultados') {
            this.infecciosoString += 'Leucograma ' + this.fichaObject.Exames.leucograma + '. ';
        }
        if (this.fichaObject.Infeccioso !== undefined) {
            this.infecciosoString += 'Em uso de ';
            this.fichaObject.Infeccioso.forEach(item => {
                this.infecciosoString += item + ', ';
            });
            // this.infecciosoString = this.infecciosoString.substr(0, this.infecciosoString.length - 2) + '. Registrado uso de ';
            // console.log(this.antibioticos[0].antibioticos);
            // for (const i of this.antibioticos[0].antibioticos) {
            //     this.infecciosoString += i + ', ';
            // }
            // this.infecciosoString = this.infecciosoString.substr(0, this.infecciosoString.length - 2)
            //     + ' em ' + this.allFichas[0].dataCriada + '. ';
        }
    }

    private prepareEndocrinoString(): void {
        
        const ficha = this.allFichas[0];
        
        this.endocrinoString = 'Paciente com ' + this.fichaObject.Endocrino.curvaGlicemica.toLowerCase() + ' (';
        if (ficha !== undefined) {
            this.endocrinoString += ficha.Endocrino.curvaGlicemica + ' em ' + ficha.dataCriada + ').';
        }
        if (this.fichaObject.BombaInfusao !== undefined) {
            Object.keys(bombaEndocrino).forEach(item => {
                Object.keys(this.fichaObject.BombaInfusao).map(res => {
                    if (res === bombaEndocrino[item]) {
                        this.endocrinoString += 'Em uso de ' + res + ' em bomba de infusão, ';
                    }
                });
            });
            this.endocrinoString = this.endocrinoString.substr(0, this.endocrinoString.length - 2) + '. ';
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

export enum exames {
    albumina = 'Albumina',
    amilase = 'Amilase',
    calcio = 'Calcio',
    creatinina = 'Creatinina',
    fosforo = 'Fósforo',
    funcaoHepaticaBilirrubinas = 'Bilirrubinas',
    funcaoHepaticaFAGGT = 'FAGGT',
    funcaoHepaticaTransaminases = 'Transaminases',
    gasometriaArterial = 'Gasometria Arterial',
    hematocrito = 'Hematócrito',
    hemoglobina = 'Hemoglobina',
    lactato = 'Lactato',
    leucograma = 'Leucograma',
    magnesio = 'Magnésio',
    pcr = 'PCR',
    plaquetas = 'Plaquetas',
    potassio = 'Potássio',
    raioxTorax = 'Raio-x do Torax',
    ureia = 'Uréia'
}

export enum bombaEndocrino {
    insulina = 'Insulina'
}

export let monthNames = [
    'Janeiro', 'Fevereiro', 'Março',
    'Abril', 'Maio', 'Junho', 'Julho',
    'Agosto', 'Setembro', 'Outubro',
    'Novembro', 'Dezembro'
];
