import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Acao } from './models/acao';
import { Rendimento } from './models/rendimento';
import { RendimentoService } from './services/rendimento.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
}) //ng serve --proxy-config proxy.config.js
export class AppComponent implements OnInit {
  title = 'my-wallet-ui';
  listRendimentoCarteira = new Array<Rendimento>();
  listRendimentoPeriodo = new Array<Rendimento>();
  acoes: Acao[];

  
  formularioBusca: FormGroup; //= new FormGroup({
   //  data1: new FormControl(''),
 //   data2: new FormControl(''),
  //    acao: new FormControl('')
 // });
 // acaoFormControl = new FormControl('');

  //data1FormControl = new FormControl('');

  //data2FormControl = new FormControl(''); 


  onDate(event): void {
   // console.log(new Date(event.value));
    //let date = new Date(event.value.toISOString());
   //console.log( this.convertDate(date));
  }

  convertDate(inputFormat) {
    let date = new Date(inputFormat.toISOString());

    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    //return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
    return [pad(d.getFullYear()), d.getDate(), pad(d.getMonth()+1)].join('-');
  }
  		//periodo?data1=2019-01-17&data2=2020-04-28


  constructor(private rendimentoService: RendimentoService, private formBuilder: FormBuilder){
    
 
//    this.formularioBusca = new FormGroup({
 //     data1: new FormControl(),
 //     data2: new FormControl(),
 //     acao: new FormControl()
 //   });
    
  }

  createForm() {
    this.formularioBusca = this.formBuilder.group({
      acao: '',
      data1: '',
      data2: ''
      
    });
  }

  ngOnInit(): void{
    this.getRendimentoCarteira();
    this.getAcoes();
    this.createForm();
   // this.formularioBusca = this.formBuilder.group({
 //     acao: [null],
 //     data1: [null],
  //    data2: [null],
  //  });
   // this.formularioBusca = new FormGroup({
     // acao: this.acaoFormControl,
     // data1: this.data1FormControl,
     // data2: this.data2FormControl,
   // });
  }
  

  onSubmit(): void {
    const acao = this.formularioBusca.value.acao;
    let data1 =this.formularioBusca.value.data1;
    let data2 =this.formularioBusca.value.data2;

    data1 = this.convertDate(data1);
    data2 = this.convertDate(data2);
    console.log(data1, data2);

    
    this.rendimentoService.getRendimentoPeriodo(data1, data2).subscribe((rendimentos: Rendimento) => {
      this.listRendimentoPeriodo.push(rendimentos);
      console.log(this.listRendimentoPeriodo);
      this.formularioBusca.reset();
    });
  }

  getAcoes(): void{
    this.rendimentoService.getAcoes().subscribe((acoes: Acao[]) => {
    this.acoes = acoes;
    console.log(this.acoes);
    console.log(this.formularioBusca.value.data01);
    });
  }

  getRendimentoCarteira(): void{
    this.rendimentoService.getRendimento().subscribe((rendimentos: Rendimento) => {

    rendimentos.rendimentoPorcento = this.format2decimal(rendimentos.rendimentoPorcento);
    rendimentos.rendimentoReal = this.format2decimal(rendimentos.rendimentoReal);

    this.listRendimentoCarteira.push(rendimentos);
    console.log(this.listRendimentoCarteira);
    });
  }

  format2decimal(valor): number{
    return parseFloat(Number(valor).toFixed(2));
  }

}
