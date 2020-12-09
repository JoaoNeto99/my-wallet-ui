import { Component, OnInit } from '@angular/core';
import { Rendimento } from './models/rendimento';
import { RendimentoService } from './services/rendimento.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-wallet-ui';

  rendimento = {} as Rendimento;
  rendimentos: Rendimento[];
  constructor(private rendimentoService: RendimentoService){
  }

  ngOnInit(){
    this.getRendimentoCarteira();
  }

  getRendimentoCarteira(){
    this.rendimentoService.getRendimento().subscribe((rendimentos: Rendimento[]) => {
      this.rendimentos = rendimentos;
      console.log(rendimentos);
    });
  }
}
