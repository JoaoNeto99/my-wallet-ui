import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Acao } from './models/acao';
import { Rendimento } from './models/rendimento';
import { RendimentoService } from './services/rendimento.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
}) // ng serve --proxy-config proxy.config.js
export class AppComponent implements OnInit {
  title = 'my-wallet-ui';

  dataMin = new Date(2017, 0, 1);
  dataMaxima = new Date();

  listRendimentoCarteira = new Array<Rendimento>();
  listRendimentoPeriodo = new Array<Rendimento>();
  listRendimentoAcao = new Array<Rendimento>();

  acoes: Acao[];

  rendiPeriodo: Rendimento = {acao: 'ACAO1', rendimentoReal: 0.0, rendimentoPorcento: 0.0,
                              quantidade: 0.0, data1: '00/00/0000', data2: '00/00/0000', valorInvestido:0.0, valorCotado:0.0 };

  formularioBusca: FormGroup;

  constructor(private rendimentoService: RendimentoService, private formBuilder: FormBuilder){ }

  ngOnInit(): void{
    this.getRendimentoCarteira();
    this.getAcoes();
    this.createForm();
    this.listRendimentoPeriodo.push(this.rendiPeriodo);
  }

  onSubmit(): void {
    const acao = this.formularioBusca.value.acao;
    const dataN1 = this.formularioBusca.value.data1;
    const dataN2 = this.formularioBusca.value.data2;

    const data1 = this.convertDate(dataN1, 1);
    const data2 = this.convertDate(dataN2, 1);

    console.log(dataN2);
    if (dataN2 === '') {
      this.rendimentoService.getRendimentoAcao(acao, data1).subscribe((rendiPeriodo: Rendimento) =>{
        this.listRendimentoPeriodo.length = 0;
        rendiPeriodo.rendimentoPorcento = this.format2decimal(rendiPeriodo.rendimentoPorcento);
        rendiPeriodo.rendimentoReal = this.format2decimal(rendiPeriodo.rendimentoReal);
        rendiPeriodo.valorCotado = this.format2decimal(rendiPeriodo.valorCotado);
        rendiPeriodo.valorInvestido = this.format2decimal(rendiPeriodo.valorInvestido);
        rendiPeriodo.data1 = this.convertDate(dataN1, 2);
        rendiPeriodo.data2 = this.convertDate(dataN2, 2);
        this.listRendimentoPeriodo.push(rendiPeriodo);
        console.log(this.listRendimentoPeriodo);
      });
    } else {
      this.rendimentoService.getRendimentoPeriodo(data1, data2).subscribe((rendiPeriodo: Rendimento) => {
        this.listRendimentoPeriodo.length = 0;
        rendiPeriodo.rendimentoPorcento = this.format2decimal(rendiPeriodo.rendimentoPorcento);
        rendiPeriodo.rendimentoReal = this.format2decimal(rendiPeriodo.rendimentoReal);
        rendiPeriodo.data1 = this.convertDate(dataN1, 2);
        rendiPeriodo.data2 = this.convertDate(dataN2, 2);
        this.listRendimentoPeriodo.push(rendiPeriodo);
        console.log(this.listRendimentoPeriodo);
      });
    }
    console.log(dataN2);
    this.formularioBusca.reset();
    this.createForm();
  }

  getRendimentoAcao(): void {
    const acao = this.formularioBusca.value.acao;
    const dataN1 = this.formularioBusca.value.data1;
  }

  getAcoes(): void{
    this.rendimentoService.getAcoes().subscribe((acoes: Acao[]) => {
    this.acoes = acoes;
    // console.log(this.acoes);
    });
  }

  getRendimentoCarteira(): void{
    this.rendimentoService.getRendimento().subscribe((rendimentos: Rendimento) => {
      rendimentos.rendimentoPorcento = this.format2decimal(rendimentos.rendimentoPorcento);
      rendimentos.rendimentoReal = this.format2decimal(rendimentos.rendimentoReal);
      this.listRendimentoCarteira.push(rendimentos);
      // console.log(this.listRendimentoCarteira);
    });
  }

  createForm(): void {
    this.formularioBusca = this.formBuilder.group({
      acao: '',
      data1: '',
      data2: '',
    });
  }

  format2decimal(valor): number{
    return parseFloat(Number(valor).toFixed(2));
  }

  convertDate(inputFormat, verificador: number): string {
    if (inputFormat === null || inputFormat === ""){
      return " ";
    } else {
    const date = new Date(inputFormat.toISOString());

    function pad(s) { return (s < 10) ? '0' + s : s; }
    const d = new Date(inputFormat);
    if (verificador === 1){
      return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())  ].join('-');
    } else {
      return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
    }
  }
  }

  // onDate(event): void {
  // console.log(new Date(event.value));
  // let date = new Date(event.value.toISOString());
  // console.log( this.convertDate(date));
  // }
}
