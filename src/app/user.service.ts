import { Injectable } from '@angular/core';
import { User } from 'src/User';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  m3oKey = "YmJiNmIwMzYtYzJlOC00YWMwLTk3NzctOWQxYzhmMDE4MmY5";
  headers = {
    headers: {
      'Authorization': `Bearer ${this.m3oKey}`,
      'Content-Type': 'application/json'
    }
  }

  constructor(private http: HttpClient) { }

  accessDatabase() {
    const data = { "table": "test" }

    return new Promise((resolve, reject) => {
      this.http.post(`https://api.m3o.com/v1/db/Read`, data, this.headers).subscribe(
        (res) => {
          //console.log(res)
          resolve(res)
        }, (err) => {
          reject(err);
        }
      )
    })
  }

  public async getUsers() {
    let users: User[] = [];
    try {
      let response: any = await this.accessDatabase();
      users = response.records
    }
    catch (err) {
      console.log(err)
    }
    return users;
  }

  getUser(id:string){
    let allUsers:User[] = [];
    this.getUsers()
      .then(data => {
        allUsers = data
        return allUsers.find(item => item.id === id)
      })
  }

  public async generateUser(id: string, password: string, name: string) {
    let newUser = {
      id: id, password: password, name: name, score: {
        perfectWin: 0,
        easyWin: 0,
        easyLoss: 0,
        medWin: 0,
        medLoss: 0,
        hardWin: 0,
        hardLoss: 0
      }, genres: {
        filmWins: 0,
        musicWins: 0,
        tvWins: 0,
        gamingWins: 0
      }
    }
    let data = {
      "record": newUser,
      "table": "test"
    }

    return new Promise((resolve, reject) => {
      this.http.post(`https://api.m3o.com/v1/db/Create`, data, this.headers).subscribe(
        (res) => {
          console.log(res)
          resolve(res)
        }, (err) => {
          reject(err);
        }
      )
    })
  }

  public async addScore(user:User, finalScore:number, difficulty:string, category:string){
    console.log(user);
    console.log(finalScore)
    console.log(difficulty)
    console.log(category)
    let data = {
      "table" : "test",
      "record" : {
        "id" :  user.id,
        "score" : {
          "perfectWin" : (finalScore === 10 ? user.score.perfectWin + 1 : user.score.perfectWin),
          "easyWin" : (((difficulty === 'easy' || difficulty === '') && finalScore >= 7) ? user.score.easyWin + 1 : user.score.easyWin),
          "easyLoss" : (((difficulty === 'easy' || difficulty === '') && finalScore < 7) ? user.score.easyLoss + 1 : user.score.easyLoss),
          "medWin" : ((difficulty === 'medium' && finalScore >= 7) ? user.score.medWin + 1 : user.score.medWin),
          "medLoss" : ((difficulty === 'medium' && finalScore < 7) ? user.score.medLoss + 1 : user.score.medLoss),
          "hardWin" : ((difficulty === 'hard' && finalScore >= 7) ? user.score.hardWin + 1 : user.score.hardWin),
          "hardLoss" : ((difficulty === 'hard' && finalScore < 7) ? user.score.hardLoss + 1 : user.score.hardLoss)
        },
        "genres" : {
          "filmWins" : ((category === '11' && finalScore >= 7) ? user.genres.filmWins + 1 : user.genres.filmWins),
          "musicWins" : ((category === '12' && finalScore >= 7) ? user.genres.musicWins + 1 : user.genres.musicWins),
          "tvWins" : ((category === '14' && finalScore >= 7) ? user.genres.tvWins + 1 : user.genres.tvWins),
          "gamingWins" : ((category === '15' && finalScore >= 7) ? user.genres.gamingWins + 1 : user.genres.gamingWins),
        }
      }
    }
    return new Promise((resolve, reject) => {
      this.http.post(`https://api.m3o.com/v1/db/Update`, data, this.headers).subscribe(
        (res) => {
          console.log(res)
          resolve(res)
        }, (err) => {
          reject(err);
        }
      )
    })
  }

  calculateWins(user:User){
    return (user.score.easyWin + user.score.medWin + user.score.hardWin);
  }

  calculateLoss(user:User){
    return (user.score.easyLoss + user.score.medLoss + user.score.hardLoss);
  }
  
  genreWins(user:User){
    return [user.genres.filmWins, user.genres.musicWins, user.genres.tvWins, user.genres.gamingWins]
  }

}
