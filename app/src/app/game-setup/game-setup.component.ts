import { Component, ViewChildren, ElementRef } from '@angular/core';
import { GameStateService } from '../game-state.service';
import { UserMessageService } from '../user-message.service';

@Component({
  selector: 'game-setup',
  templateUrl: './game-setup.component.html',
  styleUrls: ['./game-setup.component.css']
})
export class GameSetupComponent {

  constructor(private game: GameStateService, private user: UserMessageService) {}

  @ViewChildren('input') inputs: ElementRef<HTMLInputElement>[]

  tryStartGame() {
    this.inputs.forEach(element => {
      const playerName = element.nativeElement.value
      if (playerName) {
        this.game.addPlayer(playerName)
      }
    })

    try {
      this.game.startPlaying()
      this.user.alert(`Game starting with ${this.game.playerCount} players.`)
    } catch (e) {
      this.user.alert(e)
    }
  }

}
