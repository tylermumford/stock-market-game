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
    try {
      service.addPlayer("Player 1")
    } catch (e) {
      fail("Could not add player")
    }
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
    try {
      service.startPlaying()
    } catch (e) {
      expect(e).toBeDefined()
      expect(service.status).toBe(GameStatus.Preparing)
      return
    }
    fail('service should have thrown an error')
  })

  it('should allow the game to be started with at least one player', () => {
    try {
      service.addPlayer('Player 1')
      service.startPlaying()
    } catch (e) {
      fail('service should not have thrown an error')
    }
    expect(service.status).toBe(GameStatus.Playing)
  })
});
