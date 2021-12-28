import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../user.service';
import { User } from 'src/User';

@Component({
  selector: 'stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  justStats:boolean = true;
  users:User[] = [];
  sortedUsers:User[] = [];
  @Input() finalInfo: { endGame:boolean, guest:boolean, id: string, score: number }
  //Lots of plot data objects are going to be declared here. It's currently the only way I see this playing out?
  gameData: object[] = []
  gameLayout: object = {}

  genreData: object[] = [];
  genreLayout: object = {};

  leaderboardData: object[] = [];
  leaderboardLayout: object = {};

  constructor(private userService: UserService) {
    this.finalInfo = { endGame: false, guest: true, id: 'Guest', score: 0 }
  }

  ngOnInit():void {
    if(this.finalInfo.endGame === true){
      this.justStats = false;
    }
    this.plot(this.finalInfo.guest)
  }

  plot(guest:boolean) {
    this.userService.getUsers()
      .then(data => {
        this.users = data
        if(guest === false)
        {
          let user = this.users.find(item => item.id === this.finalInfo.id)!
          this.gamePlot(user);
          this.genrePlot(user);
        }
        this.leaderboard('win')
      })
  }

  gamePlot(user:User) {
    let winBar = {
      x: ['Easy', 'Medium', 'Hard'],
      y: [user.score.easyWin, user.score.medWin, user.score.hardWin],
      name: 'Wins',
      type: 'bar',
    }
    let lossBar = {
      x: ['Easy', 'Medium', 'Hard'],
      y: [user.score.easyLoss, user.score.medLoss, user.score.hardLoss],
      name: 'Losses',
      type: 'bar',
    }
    let perfectBar = {
      x: ['Perfect Wins'],
      y: [user.score.perfectWin],
      name: 'Perfect Wins',
      type: 'bar',
      marker: {
        color: ['#f3c677']
      }
    }

    this.gameData = [winBar, lossBar, perfectBar];
    this.gameLayout = { width: 600, height: 400, title: 'Wins/Losses By Difficulty', paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)' }
  }

  genrePlot(user:User)
  {
    this.genreData = [
      {
        ids: ['Film', 'Music', 'TV', 'Gaming'],
        values: this.userService.genreWins(user),
        labels: ['Film', 'Music', 'TV', 'Gaming'], textinfo: 'value', insidetextfont: { size: 35 }, type: 'pie',
      }
    ]
    this.genreLayout = { width: 500, height: 400, title: 'Top Genre Wins', paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)' }
  }

  leaderboard(sort:string){
    this.sortedUsers = this.users;
    if(sort === 'win')
    {
      this.sortedUsers = this.sortedUsers.sort((a,b) => this.userService.calculateWins(b) - this.userService.calculateWins(a))
    }
    else if(sort === 'perfect')
    {
      this.sortedUsers = this.sortedUsers.sort((a,b) => b.score.perfectWin - a.score.perfectWin)
    }
    //console.log(this.sortedUsers)
  }

  returnScore(user:User){
    return this.userService.calculateWins(user);
  }
}
