import { Injectable } from '@angular/core';
import { GameStatus } from './GameStatus';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  get playerCount() { return this.players.length }
  get status() { return this._status }

  addPlayer(name: string) {
    this.players.push(name)
  }

  startPlaying() {
    if (this.playerCount > 0) {
      this._status = GameStatus.Playing
    } else {
      throw new Error("Can't start playing without any players.")
    }
  }

  constructor() { }

  private _status = GameStatus.Preparing
  private players: string[] = []
}
