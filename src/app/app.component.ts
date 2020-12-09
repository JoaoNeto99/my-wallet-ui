import { Component, OnInit } from '@angular/core';
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

  listAcoes = new Array<Acao>();
  acoes: Acao[];
  //list = [{acao: 'magalu', rendimentoPorcento: 30, rendimentoReal: 40 },
  //        {acao: 'itau', rendimentoPorcento: 20, rendimentoReal: 90 }];

  list = [{nome: 'magalu'}, {nome: 'magalu'}, {nome: 'magalu'}];
  constructor(private rendimentoService: RendimentoService){
  }

  ngOnInit(){
    this.getRendimentoCarteira();
    this.getAcoes();
   // console.log(this.list);
  }

  getAcoes(){
    this.rendimentoService.getAcoes().subscribe((acoes: Acao) => {
        
    this.listAcoes.push(acoes);
    console.log(this.list);
    });
  }

  getRendimentoCarteira(){
    this.rendimentoService.getRendimento().subscribe((rendimentos: Rendimento) => {

    rendimentos.rendimentoPorcento = this.format2decimal(rendimentos.rendimentoPorcento);
    rendimentos.rendimentoReal = this.format2decimal(rendimentos.rendimentoReal);

    this.listRendimentoCarteira.push(rendimentos);
    console.log(this.listRendimentoCarteira);
    });
  }

  format2decimal(valor){
    return parseFloat(Number(valor).toFixed(2));
	}

}
