import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { TriviaService } from '../trivia.service';
import { UserService } from '../user.service';
import { User } from 'src/User';
import { APIInfo } from '../api-info';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  results: Array<any> = [];
  users: User[] = [];

  selectedUser: User;
  isGuest: boolean = true;

  loginID: string = '';
  loginPass: string = '';
  badLogin: boolean = false;
  signUp = { id: '', name: '', password: '' }
  badSignup: boolean = false;
  loginText: string = `Can't find username!`;
  badTrivia: boolean = false;

  showInfo: boolean = false;
  triviaInfo: APIInfo;

  @Output() gameOutput = new EventEmitter();

  constructor(private triviaService: TriviaService, private userService: UserService) {
    this.triviaInfo = { difficulty: '', category: '', choiceType: '' }
    this.selectedUser = {
      id: '', name: '', password: '', score: {
        perfectWin: 0,
        easyWin: 0,
        easyLoss: 0,
        medWin: 0,
        medLoss: 0,
        hardWin: 0,
        hardLoss: 0,
      }, genres: {
        filmWins: 0,
        musicWins: 0,
        tvWins: 0,
        gamingWins: 0
      }
    }
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers()
      .then(data => {
        this.users = data
        console.log(this.users)
      })
  }

  tryLogin() {
    if (this.users.some(item => item.id === this.loginID)) {
      this.badLogin = false;
      let foundUser = this.users.find(item => item.id === this.loginID)!
      if (this.loginPass === foundUser.password) {
        this.selectedUser = foundUser
        this.isGuest = false;
      }
      else {
        this.loginText = `You entered the wrong password!`
        this.badLogin = true;
      }
    }
    else {
      this.loginText = `Couldn't find username!`
      this.badLogin = true;
    }
  }

  async generateUser() {
    if (this.users.some(item => item.id === this.signUp.id) || this.signUp.id === '' || this.signUp.password === '')
      this.badSignup = true;
    else {
      await this.userService.generateUser(this.signUp.id, this.signUp.password, this.signUp.name === '' ? this.signUp.id : this.signUp.name)
      await this.getUsers();
      console.log(this.users)
    }
  }

  startGame() {
    this.triviaService.getTrivia(this.triviaInfo)
      .then((resp: any) => {
        if (resp.response_code === 1)
          this.badTrivia = true;
        else {
          this.badTrivia = false;
          let handleInfo = { isStats: false, guest: this.isGuest, id: this.isGuest ? 'Guest' : this.selectedUser.id, info: this.triviaInfo }
          this.gameOutput.emit(handleInfo)
        }
      })
  }

  viewStats() {
    let handleInfo = { isStats: true, guest: this.isGuest, id: this.isGuest ? 'Guest' : this.selectedUser.id, info: this.triviaInfo }
    this.gameOutput.emit(handleInfo)
  }

  checkTrivia() {
    this.triviaService.getTrivia(this.triviaInfo)
      .then((resp: any) => {
        if (resp.response_code === 1)
          this.badTrivia = true;
        else
          this.badTrivia = false;
      })
  }
}
