import { Component, Input, OnDestroy } from '@angular/core';
import { GameStateService, Roll } from '../game-state.service';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'round-entry',
  templateUrl: './round-entry.component.html',
  styleUrls: ['./round-entry.component.css']
})
export class RoundEntryComponent implements OnDestroy {

  @Input() round: number

  get pointsAtStake() { return this.game.pointsAtStakeInRound(this.round) }
  get players() { return this.game.players }

  roundForm = new FormGroup({
    diceRolls: new FormArray([])
  })

  get diceRolls(): FormArray { return this.roundForm.get('diceRolls') as FormArray }

  get columnCount() {
    const fixedColumnCount = 2
    const dynamicColumnCount = this.players.length
    return fixedColumnCount + dynamicColumnCount;
  }

  errorMessage = ''

  constructor(private game: GameStateService) {
    this.build()

    const s = this.roundForm.valueChanges.subscribe(formValue => {
      this.updateRolls(formValue.diceRolls)
      this.autoExpand(formValue)
      this.updatePlayersOut(formValue)
    })
    this.subscriptions.push(s)
  }

  setPlayerBackIn(playerName: string) {
    const player = this.roundForm.get(playerName)
    player.setValue(null)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  private subscriptions: Subscription[] = []

  private build() {
    for (let i = 0; i < 4; i++) {
      this.expand()
    }
    this.players.forEach( playerName => this.roundForm.addControl(playerName, new FormControl()) )
  }

  private expand() {
    this.diceRolls.push(new FormControl())
  }

  private updateRolls(diceRollValues: any[]) {
    const rolls: string[] = []
    diceRollValues.forEach(diceRollValue => {
      rolls.push(diceRollValue?.toUpperCase() ?? diceRollValue)
    })

    try {
      this.game.setRollsForRound(this.round, rolls)
      this.errorMessage = ''
    } catch (error) {
      this.errorMessage = error.message
    }
  }

  private autoExpand(formValue: any) {
    const lastRollValue = formValue.diceRolls[formValue.diceRolls.length - 1]
    if (lastRollValue !== null && lastRollValue !== '7') {
      this.expand()
    }
  }

  private updatePlayersOut(formValue: any) {
    this.players.forEach(playerName => {
      const outIndex: number = formValue[playerName]
      if (outIndex === null) {
        this.game.setPlayerBackIn(playerName, this.round)
      } else {
        this.game.setPlayerOut(playerName, this.round, outIndex)
      }
    });
  }
}
