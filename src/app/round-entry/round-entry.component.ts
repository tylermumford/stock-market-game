import { Component, ElementRef, Input, OnDestroy, ViewChildren } from '@angular/core';
import { GameStateService } from '../game-state.service';
import { UntypedFormGroup, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'round-entry',
  templateUrl: './round-entry.component.html',
  styleUrls: ['./round-entry.component.css']
})
export class RoundEntryComponent implements OnDestroy {

  @Input() round: number

  @ViewChildren('rollInput') rollElements: ElementRef<HTMLInputElement>[]

  get pointsAtStake() { return this.game.pointsAtStakeInRound(this.round) }
  get players() { return this.game.players }

  roundForm = new UntypedFormGroup({
    diceRolls: new UntypedFormArray([])
    // FormControls will be added for each player in the `build` method.
  })

  get diceRolls(): UntypedFormArray { return this.roundForm.get('diceRolls') as UntypedFormArray }

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

  refocusNextEmptyRollInput() {
    let target: HTMLInputElement
    this.rollElements.forEach(element => {
      if (!element.nativeElement.value && !target) {
        target = element.nativeElement
      }
    })

    target.focus()
  }

  setPlayerBackIn(playerName: string) {
    const player = this.roundForm.get(playerName)
    player.setValue(null)
  }

  isPlayerStillIn(playerName: string) {
    return this.game.playerIsIn(playerName, this.round)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  private subscriptions: Subscription[] = []

  private build() {
    for (let i = 0; i < 4; i++) {
      this.expand()
    }
    this.players.forEach( playerName => this.roundForm.addControl(playerName, new UntypedFormControl()) )
  }

  private expand() {
    this.diceRolls.push(new UntypedFormControl())
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
      const roundPlayerWentOut: number = formValue[playerName]
      const isPlayerStillIn = roundPlayerWentOut === null

      if (isPlayerStillIn) {
        this.game.setPlayerBackIn(playerName, this.round)
      } else {
        this.game.setPlayerOut(playerName, this.round, roundPlayerWentOut)
      }
    })
  }
}
