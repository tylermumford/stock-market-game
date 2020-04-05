import { Injectable } from '@angular/core';
import { GameStatus } from './GameStatus';

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
    const rolls = this._roundRolls[round];
    if (rolls === undefined)
      return 0

    return rolls
      .map(n => (n === 7) ? 70 : n)
      .reduce((prev, curr, i) => {
        const prevN = prev as number
        if (curr === 'D')
          return prevN * 2
        else
          return prevN + curr
      })
  }

  setRollsForRound(round: number, rolls: Roll[]) {
    rolls.forEach(this.rejectBadRollNumber)
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

  private rejectBadRollNumber(attemptedRoll: number) {
    const r = attemptedRoll;
    if (r < 2 || r > 12) {
      throw new Error(`It's impossible to roll a ${r} with two dice.`)
    }
  }
}

type Roll = number | 'D'

interface RoundRolls {
  [round: number]: Roll[]
}
