import { Component, OnInit } from '@angular/core';
import { TriviaService } from '../trivia.service';
import { UserService } from '../user.service';
import { GameInfo } from './game-info';
import { APIInfo } from '../api-info';
import { User } from 'src/User';

@Component({
  selector: 'handler',
  templateUrl: './handler.component.html',
  styleUrls: ['./handler.component.scss']
})
export class HandlerComponent implements OnInit {
  users: User[] = []
  dbInfo: object = {}

  setup: boolean = false;
  game: boolean = false;
  gameStats: boolean = false;

  isGuest: boolean = false;
  apiInfo: APIInfo
  activeUser: string = ''
  finalScore: number = 0;
  finalInfo: { endGame: boolean, guest: boolean, id: string, score: number }

  constructor(private userService: UserService, private triviaService: TriviaService) {
    this.apiInfo = { category: '', difficulty: '', choiceType: '' }
    //this.users = this.userService.getUsers();
    this.finalInfo = { endGame: false, guest: true, id: 'Guest', score: 0 }
  }

  ngOnInit(): void {
    this.setup = true;
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers()
      .then(data => {
        this.users = data
        //console.log(this.users)
      })
  }

  handleOutput(gameInfo: GameInfo) {
    if (gameInfo.isStats === false) {
      this.startGame(gameInfo)
    }
    else {
      this.finalInfo.endGame = false;
      this.finalInfo.guest = gameInfo.guest;
      this.finalInfo.id = gameInfo.id;

      this.setup = false;
      this.gameStats = true;
    }
  }

  showStats(isGuest: boolean, id: string) {
    //console.log(isGuest)
  }

  startGame(gameInfo: GameInfo) {
    if (gameInfo.guest === true) {
      this.isGuest = true
      this.activeUser = 'Guest'
    }
    else {
      this.isGuest = false;
      this.activeUser = gameInfo.id
    }
    //console.log(this.isGuest)
    //console.log(this.activeUser)
    this.apiInfo = gameInfo.info;
    this.setup = false;
    this.game = true;
  }

  async endGame(finalScore: number) {
    this.finalInfo = { endGame: true, guest: this.isGuest, id: this.activeUser, score: finalScore }
    //console.log(this.activeUser)
    if (this.isGuest === false) {
      await this.userService.addScore(this.users.find(item => item.id === this.activeUser)!, finalScore, this.apiInfo.difficulty, this.apiInfo.category)
    }

    this.game = false;
    this.gameStats = true;
  }

  restartGame() {
    this.getUsers();
    this.game = false;
    this.gameStats = false;
    this.setup = true;
  }
}
