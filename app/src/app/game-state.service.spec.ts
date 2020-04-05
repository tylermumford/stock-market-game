import { TestBed } from '@angular/core/testing';

import { GameStateService } from './game-state.service';
import { GameStatus } from './GameStatus';
import { fail } from 'assert';

describe('GameStateService', () => {
  let service: GameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with no players', () => {
    expect(service.playerCount).toBe(0);
  })

  it('should start in the "Preparing" status', () => {
    expect(service.status).toBe(GameStatus.Preparing);
  })

  it('should allow a player to be added', () => {
    expect(() => service.addPlayer("Player 1")).not.toThrow()
    expect(service.playerCount).toBe(1);
  })

  it('should allow three players to be added', () => {
    try {
      service.addPlayer("Player 1")
      service.addPlayer("Player 2")
      service.addPlayer("Player 3")
    } catch (e) {
      fail("Could not add player")
    }
    expect(service.playerCount).toBe(3);
  })

  it('should not allow the game to be started with 0 players', () => {
    expect(service.playerCount).toBe(0)
    expect(service.startPlaying).toThrow()
    expect(service.status).toBe(GameStatus.Preparing)
  })

  it('should allow the game to be started with at least one player', () => {
    expect(() => {
      service.addPlayer('Player 1')
      service.startPlaying()
    }).not.toThrow()
    expect(service.status).toBe(GameStatus.Playing)
  })
});
