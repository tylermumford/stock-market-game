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

  group = new FormGroup({
    rollInputs: new FormArray([
      new FormControl(null),
      new FormControl(null),
      new FormControl(null),
      new FormControl(null),
    ])
  })

  get rollInputs(): FormArray { return this.group.get('rollInputs') as FormArray }

  errorMessage = ''

  constructor(private game: GameStateService) {
    const s = this.rollInputs.valueChanges.subscribe(rolls => {
      try {
        this.game.setRollsForRound(this.round, rolls)
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = error.message
      }

      if (rolls[rolls.length - 1] !== null) {
        this.expand()
      }
    })
    this.subscriptions.push(s)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  private subscriptions: Subscription[] = []

  private expand() {
    this.rollInputs.push(new FormControl(null))
  }
}
