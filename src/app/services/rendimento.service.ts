import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Rendimento } from '../models/rendimento';
import { Acao } from '../models/acao';
@Injectable({
  providedIn: 'root'
})
export class RendimentoService {

  url = 'http://localhost:4200/api/carteiraJava';

  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
  };

  // obtem acoes
  getAcoes(): Observable<Acao> {
    return this.httpClient.get<Acao>(this.url + '/' + 'acoes')
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  // obtem o rendimento da carteira
  getRendimento(): Observable<Rendimento[]> {
    return this.httpClient.get<Rendimento[]>(this.url + '/' + 'carteira')
    .pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  // Obtem rendimento de uma acao em determinado dia
  getRendimentoAcao(acao: string, data: string): Observable<Rendimento> {
    return this.httpClient.get<Rendimento>(this.url + '/' + 'dia?acao=' + acao + '&data=' + data)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  // Obtem rendimento de um periodo
  getRendimentoPeriodo(acao: string, dataInicial: string, dataFinal: string): Observable<Rendimento> {
    return this.httpClient.get<Rendimento>(this.url + '/' + 'periodo?data1=' + dataInicial + '&data2=' + dataFinal)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
