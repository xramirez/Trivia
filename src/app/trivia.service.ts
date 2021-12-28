import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIInfo } from './api-info';

@Injectable({
  providedIn: 'root'
})
export class TriviaService {

  constructor(private http: HttpClient) { }


  public getTrivia(info: APIInfo) {
    return new Promise((resolve, reject) => {
      this.http.get(`https://opentdb.com/api.php?amount=10&category=${info.category}&difficulty=${info.difficulty}&type=${info.choiceType}`).subscribe(
        (res) => {
          resolve(res);
        }, (err) => {
          reject(err);
        }
      )
    })
  }
}
