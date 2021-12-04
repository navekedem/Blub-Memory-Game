import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { GameStep } from 'src/app/models/game-step';
import { Blub } from '../../models/blub';
import { User } from '../../models/user';
import { GameService } from '../game-service.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

  //Game Props
  @ViewChildren("blubsElements") blubsElements!: QueryList<ElementRef>;
  @ViewChildren("modal") modal!: QueryList<ElementRef>;
  blubs: Blub[] = [];
  steps: GameStep[] = [];
  userGuess: number[] = [];
  user: User;
  startGame: boolean = false;
  endGame: boolean = false;
  modalRef!: ElementRef;

  constructor(private gameService: GameService, private router: Router) {
    //Get username with state object route
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { username: string, };
    if(state && state.username) {
      this.gameService.updateUserName(state.username);      
    } else {this.router.navigateByUrl('')}
    this.user = this.gameService.getUser();
    //Listen to changes from service on user
    this.gameService.getUserUpdateLiscener().subscribe((userData: { userData: User }) => {
      this.user = userData.userData;
    });

  }

  ngOnInit(): void {
    this.gameService.intializeBlubArray();
    this.blubs = this.gameService.getBlubArray();
  }
  

  handleBlubClick(blub: Blub) {
    this.userGuess.push(blub.step);
    const interval = 800;
    const self = this;
    let blubElement = this.blubsElements.toArray().find(({ nativeElement }) => nativeElement.id === blub.color);
    if (blubElement) {
      let buttonElement = blubElement.nativeElement.querySelector('.game-board-button') as HTMLElement;
      this.colorAnimation(buttonElement,blub.color,true);
    }

    //Compare game step with user click
    if (this.validateClickMatch(blub)) {
      let gameMsg = document.getElementById("game-msg") as HTMLElement;
      this.steps[blub.step - 1].checked = true;
      if (this.userGuess.length === this.steps.length) {
        gameMsg.textContent = "Nice guess! let's try more";
        this.gameService.updateCurrentScore();
        //check if user win the game
        if (this.userGuess.length === this.blubs.length) {
          this.gameService.addScoreToList();
          this.showModal(true);
          return;
        }
        
        //Hide Message from User and start the next round
        setTimeout(function () {
          gameMsg.textContent = "";
          self.disabledBtns(true);
          self.lightBlub(blub.step,true);
        }, interval)
      }


    } else {
      //user lost The game
      this.gameService.addScoreToList();
      this.showModal(false);
    }
  }

  validateClickMatch(blub: Blub): boolean {
    if(this.steps[blub.step - 1]) {
      console.log(this.steps[blub.step - 1]);
      if(blub.step === this.steps[blub.step - 1].step && !this.steps[blub.step - 1].checked ) {
        return true;
      }
    }
    return false;
  }


  showModal(win: boolean) {
    this.endGame = true
    this.modal.changes.subscribe((modal: QueryList<ElementRef>) => {
      this.modalRef = modal.first;
      if(this.modalRef) {
        let modalEl = this.modalRef.nativeElement;
        let modalTitle = modalEl.querySelector('.modal-title') as HTMLElement;
        if (win) {
          modalTitle.textContent = "You Win! \n Want to play again?"
        } else {
          modalTitle.textContent = "You Lose! \n Want to play again?"
        }

      }

    });
  }

  closeModal() {
    this.endGame = false;
    this.startGame = false;
  }
  intializeGame(): void {
    this.userGuess = [];
    this.gameService.initScore();
    this.steps = [];
    this.startGame = true;
    this.endGame = false;
    this.lightBlub(0,false);
  }

  startNewRound() {
    this.steps.forEach(gameStep => {gameStep.checked = false})
  }

  lightBlub(step: number,checked:boolean): void {
    const interval = 1000;
    const self = this;
    let gameStep: GameStep = { step: step + 1, checked: checked }
    this.steps.push(gameStep);

    //find the match bulb to step order
    this.steps.forEach((gameStep,index) => {
      let blub: Blub = this.blubs.find(({ step }) => step === gameStep.step) as Blub;
      setTimeout(function () {
        self.handleHtmlBlubElements(blub);
        
        if (index + 1 === self.steps.length) {
          //Set lightblubs buttons enabled 
          self.disabledBtns(false);
          self.userGuess = [];
          self.startNewRound();
        }
      }, index * interval);
    })
  }

  handleHtmlBlubElements(blub: Blub): void {
    const self = this;
    const interval = 500;

    if (blub) {
      // find the Blub Element
      let blubElement = this.blubsElements.toArray().find(({ nativeElement }) => nativeElement.id === blub.color);
      if (blubElement) {
        let buttonElement = blubElement.nativeElement.querySelector('.game-board-button') as HTMLElement;
        this.colorAnimation(buttonElement,blub.color,false);

        let stepElement = blubElement.nativeElement.querySelector('.game-board-step') as HTMLElement; 
        stepElement.textContent = blub.step.toString();
        setTimeout(function () {
          self.hideStepsAndColors(buttonElement, stepElement);
        }, interval)
      }

    }
  }
  colorAnimation(buttonElement:HTMLElement,color:string,clickAnimation:boolean) {
    buttonElement.style.backgroundColor = color;
    if(clickAnimation) {setTimeout(function(){buttonElement.style.backgroundColor = "transparent";},100)}
  }
  disabledBtns(disabledBtns: boolean): void {
    this.blubsElements.toArray().forEach((blub, index) => {
      let buttonElement = blub.nativeElement.querySelector('.game-board-button') as HTMLButtonElement;
      buttonElement.disabled = disabledBtns;
    })
  }
  hideStepsAndColors(button: HTMLElement, step: HTMLElement): void {
    button.style.backgroundColor = "transparent";
    step.textContent = "";
  }
}
