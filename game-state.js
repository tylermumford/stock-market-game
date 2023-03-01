/**
 * Keep track of a Stock Market game. Players and scores.
 */
export class GameState {

  get playerCount() { return this._players.length }
  get players() { return this._players }
  get scores() { return this._scores }

  /** Scores sorted highest first. */
  get scoresArray() {
    const players = this._players.slice()
    const result = []
    players.forEach(playerName => result.push({ playerName: playerName, points: this.scores[playerName] }))
    result.sort((a, b) => b.points - a.points);
    return result
  }
  get currentRound() { return 1 }

  addPlayer(name) {
    this._players.push(name)
    this.scores[name] = 0
  }

  startPlaying() {
    if (this.playerCount > 0) {
      for (let r = 1; r <= 20; r++) {
        this._scoresByRound[r] = {}
        this._players.forEach(playerName => {
          this._scoresByRound[r][playerName] = null
        })
      }
    } else {
      throw new Error("Can't start playing without any players.")
    }
  }

  /**
   * @param round: number
   */
  pointsAtStakeInRound(round) {
    const rolls = this._roundRolls[round]
    if (rolls === undefined)
      return 0

    return this.pointsForRolls(rolls)
  }

  /**
   * Accepts rolls as strings or numbers, but throws an Error if they are invalid.
   * They must be 'D' or numbers 2–12. Silently ignores nulls and empty strings.
   * @param round: number
   * @param rolls: any[]
   */
  setRollsForRound(round, rolls) {
    rolls = rolls.map(this.tryConvertToRoll)
    rolls.forEach(this.rejectBadRollNumber)
    rolls.slice(0, 3).forEach(this.rejectDs)
    this._roundRolls[round] = rolls
  }

  /**
   * @param playerName: string
   * @param round: number
   * @param withRollIndex: number
   */
  setPlayerOut(playerName, round, withRollIndex) {
    if (withRollIndex > this._roundRolls[round].length - 1)
      throw new Error("Can't go out at that time")

    const rollsIncluded = this._roundRolls[round].slice(0, withRollIndex + 1)
    const pointsScored = this.pointsForRolls(rollsIncluded)
    this._scoresByRound[round][playerName] = pointsScored
    this.recalculateTotalScores()
  }

  /**
   * @param playerName: string
   * @param round: number
   */
  setPlayerBackIn(playerName, round) {
    this._scoresByRound[round][playerName] = null
    this.recalculateTotalScores()
  }

  /**
   * @param playerName: string
   * @param round: number
   */
  playerIsIn(playerName, round) {
    return this._scoresByRound[round][playerName] == null
  }

  /** _players: string[] */
  _players = []
  /** _scores: {[player: string]: number} */
  _scores = {}
  /**
   * _scoresByRound:
   *   [round: number]: {[player: string]: number }
   */
  _scoresByRound = {}

  /**
   * _roundRolls: {[round: number]: Roll[] }
   */
  _roundRolls = {}

  /**
   * @param rawRoll: unknown
   * @returns Roll
   */
  tryConvertToRoll(rawRoll) {
    if (rawRoll === 'D') {
      return 'D'
    } else if (rawRoll === null || rawRoll === '') {
      return null
    } else if (typeof rawRoll === 'string') {
      const r = Number.parseInt(rawRoll)
      if (!Number.isNaN(r))
        return r
    } else if (typeof rawRoll === 'number') {
      return rawRoll
    }
    throw new Error('Invalid roll: Rolls must be D or a whole number.')
  }

  /**
   * @param attemptedRoll: Roll
   */
  rejectBadRollNumber(attemptedRoll) {
    const r = attemptedRoll
    if (typeof r === 'number' && r < 2 || r > 12) {
      throw new Error(`It's impossible to roll a ${r} with two dice.`)
    }
  }

  /**
   * @param attemptedRoll: Roll
   */
  rejectDs(attemptedRoll) {
    if (attemptedRoll === 'D')
      throw new Error('Doubles don\'t count in the first three rolls. Please enter the number instead.')
  }

  /**
   * @param rolls: Roll[]
   */
  pointsForRolls(rolls) {
    let sum = 0
    scoring:
    for (let i = 0; i < rolls.length; i++) {
      const roll = rolls[i]
      if (i <= 2) {
        const rollN = roll // as number, when this was TS
        sum += (rollN === 7) ? 70 : rollN
      } else {
        switch (roll) {
          default:
            sum += roll // as number
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

  recalculateTotalScores() {
    this._scores = {}
    this._players.forEach(playerName => this._scores[playerName] = 0)

    for (let round = 1; round <= 20; round++) {
      const scoresForRound = this._scoresByRound[round]
      this._players.forEach(playerName => {
        this._scores[playerName] += scoresForRound[playerName]
      })
    }
  }
}

/* Old TypeScript types
export type Roll = number | 'D'

interface RoundRolls {
  [round: number]: Roll[]
}

interface ScoresByRound {
  [round: number]: {
    [player: string]: number
  }
}
*/
