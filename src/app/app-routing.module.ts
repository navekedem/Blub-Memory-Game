import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameBoardComponent } from './game/game-board/game-board.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path:'',component: LoginComponent },
  {path:'game',component: GameBoardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
