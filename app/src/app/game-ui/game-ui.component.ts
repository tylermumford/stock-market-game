import { Component, OnInit } from '@angular/core';
import { GameStateService } from '../game-state.service';

@Component({
  selector: 'game-ui',
  templateUrl: './game-ui.component.html',
  styleUrls: ['./game-ui.component.css']
})
export class GameUiComponent implements OnInit {

  twentyRounds = []

  constructor(private game: GameStateService) {
    for (let i = 1; i <= 20; i++) {
      this.twentyRounds.push(i)
    }
  }

  ngOnInit(): void {
  }

  get scores() { return this.game.scoresArray }

}
