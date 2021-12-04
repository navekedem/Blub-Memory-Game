import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { GameService } from '../game-service.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  user: User;
  toggleList: boolean = false;
  constructor(private gameService: GameService) {
    this.user = this.gameService.getUser();
    this.gameService.getUserUpdateLiscener().subscribe((userData: { userData: User }) => {
      this.user = userData.userData;
    });
  }

  ngOnInit(): void {
    var currentDate = new Date();
    var date = document.getElementById('date') as HTMLElement;
    date.textContent = currentDate.toLocaleDateString('he-IL');
    setInterval(this.time, 1000);
  }
  time() {
    var clock = document.getElementById('clock') as HTMLElement;
    var d: Date = new Date();
    var s: number = d.getSeconds();
    var m: number = d.getMinutes();
    var h: number = d.getHours();
    clock.textContent = ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2) + ":" + ("0" + s).substr(-2);
  }

  toggleScoreList(): void {
    this.toggleList ? this.toggleList = false : this.toggleList = true;

  }
}
