import { Injectable } from '@angular/core'
import { GameStatus } from './GameStatus'

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  get playerCount() { return this.players.length }
  get status() { return this._status }
  get scores() { return this._scores }
  get currentRound() { return 1 }

  addPlayer(name: string) {
    this.players.push(name)
    this.scores[name] = 0
  }

  startPlaying() {
    if (this.playerCount > 0) {
      this._status = GameStatus.Playing
    } else {
      throw new Error("Can't start playing without any players.")
    }
  }

  pointsAtStakeInRound(round: number) {
    const rolls = this._roundRolls[round]
    if (rolls === undefined)
      return 0

    let sum = 0
    scoring:
    for (let i = 0; i < rolls.length; i++) {
      const roll = rolls[i]
      if (i <= 2) {
        const rollN = roll as number
        sum += (rollN === 7) ? 70 : rollN
      } else {
        switch (roll) {
          default:
            sum += roll as number
            break
          case 'D':
            sum *= 2
            break
          case 7:
            sum = 0
            break scoring
        }
      }
    }

    return sum
  }

  setRollsForRound(round: number, rolls: Roll[]) {
    rolls.forEach(this.rejectBadRollNumber)
    rolls.slice(0, 3).forEach(this.rejectDs)
    this._roundRolls[round] = rolls
  }

  setPlayerOut(playerName: string, round: number, withRollIndex: number) {
    if (withRollIndex > this._roundRolls[round].length - 1)
      throw new Error("Can't go out at that time")
  }

  private _status = GameStatus.Preparing
  private players: string[] = []
  private _scores: {[player: string]: number} = {}

  private _roundRolls: RoundRolls = {}

  private rejectBadRollNumber(attemptedRoll: Roll) {
    const r = attemptedRoll
    if (typeof r === 'number' && r < 2 || r > 12) {
      throw new Error(`It's impossible to roll a ${r} with two dice.`)
    }
  }

  private rejectDs(attemptedRoll: Roll) {
    if (attemptedRoll === 'D')
      throw new Error('A D is invalid in the first three rolls. Please enter the number instead.')
  }
}

type Roll = number | 'D'

interface RoundRolls {
  [round: number]: Roll[]
}
