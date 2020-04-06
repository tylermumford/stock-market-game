import { Component } from '@angular/core';
import { GameStateService } from './game-state.service';
import { GameStatus } from './GameStatus';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Stock Market Game'

  get isStatusPreparing() { return this.game.status === GameStatus.Preparing }
  get isStatusPlaying() { return this.game.status === GameStatus.Playing }

  constructor(private game: GameStateService) {}
}
