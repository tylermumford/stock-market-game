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

  group = new FormGroup({
    rows: new FormArray([])
  })

  get rows(): FormArray { return this.group.get('rows') as FormArray }

  errorMessage = ''

  constructor(private game: GameStateService) {
    this.build()

    const s = this.rows.valueChanges.subscribe((compoundTableValue: any[]) => {
      const rolls: string[] = []
      compoundTableValue.forEach((compoundRowValue: any[]) => {
        rolls.push(compoundRowValue[0]?.toUpperCase() ?? compoundRowValue[0])
      })

      try {
        this.game.setRollsForRound(this.round, rolls)
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = error.message
      }

      const lastRollValue = rolls[rolls.length - 1]
      if (lastRollValue !== null && lastRollValue !== '7') {
        this.expand()
      }
    })
    this.subscriptions.push(s)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  private subscriptions: Subscription[] = []

  private build() {
    for (let i = 0; i < 4; i++) {
      this.expand()
    }
  }

  private expand() {
    const rowControls = new FormArray([
      new FormControl(null) // One for the dice roll
    ])
    this.players.forEach(() => {
      rowControls.push(new FormControl(null)) // One for each player's checkbox
    });
    this.rows.push(rowControls)
  }
}
