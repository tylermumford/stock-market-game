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
      for (let r = 1; r <= 20; r++) {
        this._scoresByRound[r] = {}
        this.players.forEach(playerName => {
          this._scoresByRound[r][playerName] = 0
        })
      }
    } else {
      throw new Error("Can't start playing without any players.")
    }
  }

  pointsAtStakeInRound(round: number) {
    const rolls = this._roundRolls[round]
    if (rolls === undefined)
      return 0

    return this.pointsForRolls(rolls)
  }

  setRollsForRound(round: number, rolls: Roll[]) {
    rolls.forEach(this.rejectBadRollNumber)
    rolls.slice(0, 3).forEach(this.rejectDs)
    this._roundRolls[round] = rolls
  }

  setPlayerOut(playerName: string, round: number, withRollIndex: number) {
    if (withRollIndex > this._roundRolls[round].length - 1)
      throw new Error("Can't go out at that time")

    const rollsIncluded = this._roundRolls[round].slice(0, withRollIndex + 1)
    const pointsScored = this.pointsForRolls(rollsIncluded)
    this._scoresByRound[round][playerName] = pointsScored
    this.recalculateTotalScores()
  }

  setPlayerBackIn(playerName: string, round: number) {
    this._scoresByRound[round][playerName] = 0
    this.recalculateTotalScores()
  }

  private _status = GameStatus.Preparing
  private players: string[] = []
  private _scores: {[player: string]: number} = {}
  private _scoresByRound: ScoresByRound = {}

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

  private pointsForRolls(rolls: Roll[]) {
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

  private recalculateTotalScores() {
    this._scores = {}
    this.players.forEach(playerName => this._scores[playerName] = 0)

    for (let round = 1; round <= 20; round++) {
      const scoresForRound = this._scoresByRound[round]
      this.players.forEach(playerName => {
        this._scores[playerName] += scoresForRound[playerName]
      })
    }
  }
}

type Roll = number | 'D'

interface RoundRolls {
  [round: number]: Roll[]
}

interface ScoresByRound {
  [round: number]: {
    [player: string]: number
  }
}
