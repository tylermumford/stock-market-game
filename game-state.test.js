// TODO: Get these tests running with `deno test`.

import {
  describe,
  it,
  beforeEach,
} from "https://deno.land/std@0.178.0/testing/bdd.ts";
import { expect } from 'npm:jasmine-core';
import { GameState } from './game-state.js'

describe('GameState class', () => {
  let service;

  beforeEach(() => {
    service = new GameState();
  })

  describe('Preparing a game', () => {
    it('should be created', () => {
      expect(service).toBeTruthy()
    })

    it('should start with no players', () => {
      expect(service.playerCount).toBe(0)
    })

    it('should start in the "Preparing" status', () => {
      expect(service.status).toBe(GameStatus.Preparing)
    })

    it('should allow a player to be added', () => {
      expect(() => service.addPlayer("Player 1")).not.toThrow()
      expect(service.playerCount).toBe(1)
    })

    it('should allow three players to be added', () => {
      try {
        service.addPlayer("Player 1")
        service.addPlayer("Player 2")
        service.addPlayer("Player 3")
      } catch (e) {
        fail("Could not add player")
      }
      expect(service.playerCount).toBe(3)
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
  })

  describe('Gameplay', () => {
    const p1 = 'Player One', p2 = 'Player Two'

    beforeEach(() => {
      service.addPlayer(p1)
      service.addPlayer(p2)
      service.startPlaying()
    })

    it('should start at zero score', () => {
      expect(service.scores).toBeTruthy()
      expect(service.scores).toEqual({
        [p1]: 0,
        [p2]: 0
      })
    })

    it('should start on round one', () => {
      expect(service.currentRound).toBe(1)
    })

    it('should allow the rolls to be updated', () => {
      expect(() => service.setRollsForRound(1, [])).not.toThrow()
      expect(() => service.setRollsForRound(1, [2])).not.toThrow()
      expect(() => service.setRollsForRound(1, [3])).not.toThrow()
      expect(() => service.setRollsForRound(1, [7])).not.toThrow()
      expect(() => service.setRollsForRound(1, [12])).not.toThrow()
    })

    it('should convert string rolls', () => {
      service.setRollsForRound(1, ['5'])
      expect(service.pointsAtStakeInRound(1)).toBe(5)
    })

    it('should disregard null rolls', () => {
      expect(() => service.setRollsForRound(1, [null])).not.toThrow()
      expect(service.pointsAtStakeInRound(1)).toBe(0)
      service.setRollsForRound(1, [5, null])
      expect(service.pointsAtStakeInRound(1)).toBe(5)
    })

    it('should disregard empty string rolls', () => {
      expect(() => service.setRollsForRound(1, [''])).not.toThrow()
      expect(service.pointsAtStakeInRound(1)).toBe(0)
      service.setRollsForRound(1, [5, ''])
      expect(service.pointsAtStakeInRound(1)).toBe(5)
    })

    it('should allow a D for rolling doubles after three rolls', () => {
      expect(() => service.setRollsForRound(1, [5, 5, 5, 'D'])).not.toThrow()
      expect(() => service.setRollsForRound(1, [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 'D'])).not.toThrow()
    })

    it('should reject a D roll in the first three', () => {
      expect(() => service.setRollsForRound(1, ['D'])).toThrow()
      expect(() => service.setRollsForRound(1, [5, 'D'])).toThrow()
      expect(() => service.setRollsForRound(1, [5, 5, 'D'])).toThrow()
    })

    it('should reject impossible roll numbers', () => {
      expect(() => service.setRollsForRound(1, [0])).toThrow()
      expect(() => service.setRollsForRound(1, [1])).toThrow()
      expect(() => service.setRollsForRound(1, [-1])).toThrow()
      expect(() => service.setRollsForRound(1, [13])).toThrow()
      expect(() => service.setRollsForRound(1, [70])).toThrow()
    })

    describe('Points at stake', () => {
      it('should start at zero', () => {
        expect(service.pointsAtStakeInRound(1)).toBe(0)
      })

      it('should sum the basic dice rolls', () => {
        service.setRollsForRound(1, [3])
        expect(service.pointsAtStakeInRound(1)).toBe(3)
        service.setRollsForRound(1, [3, 5])
        expect(service.pointsAtStakeInRound(1)).toBe(8)
        service.setRollsForRound(1, [3, 5, 10, 11, 3])
        expect(service.pointsAtStakeInRound(1)).toBe(32)
      })

      it('should score seventy in the first three rolls', () => {
        service.setRollsForRound(1, [7])
        expect(service.pointsAtStakeInRound(1)).toBe(70)
        service.setRollsForRound(1, [5, 7])
        expect(service.pointsAtStakeInRound(1)).toBe(75)
        service.setRollsForRound(1, [5, 5, 7])
        expect(service.pointsAtStakeInRound(1)).toBe(80)
      })

      it('should score zero if seven is rolled after the first three rolls', () => {
        service.setRollsForRound(1, [5, 5, 5, 7])
        expect(service.pointsAtStakeInRound(1)).toBe(0)
      })

      it('should double the points if "D" is rolled', () => {
        service.setRollsForRound(1, [5, 5, 5, 'D'])
        expect(service.pointsAtStakeInRound(1)).toBe(30)
      })

      it('should correctly score miscellaneous scenarios', () => {
        service.setRollsForRound(1, [7, 7, 7, 'D'])
        expect(service.pointsAtStakeInRound(1)).toBe(420)
        service.setRollsForRound(1, [5, 5, 5, 'D', 'D'])
        expect(service.pointsAtStakeInRound(1)).toBe(60)
        service.setRollsForRound(1, [5, 5, 5, 'D', 8, 9, 7])
        expect(service.pointsAtStakeInRound(1)).toBe(0)
      })

      // Not sure how it should handle being told about rolls
      // after a 7.
    })

    describe('Players going out', () => {
      it('should report that players start "in"', () => {
        expect(service.playerIsIn(p1, 1)).toBeTrue();
      })

      it('should reject going out "in the future"', () => {
        expect(() => service.setPlayerOut(p1, 1, 0)).toThrow()
        service.setRollsForRound(1, [3, 5, 9])
        expect(() => service.setPlayerOut(p1, 1, 3)).toThrow()
        expect(() => service.setPlayerOut(p1, 2, 0)).toThrow()
      })

      it('should accept going out after three rolls', () => {
        service.setRollsForRound(1, [3, 5, 9])
        expect(() => service.setPlayerOut(p1, 1, 2)).not.toThrow()
      })

      it('should report that a player has gone out', () => {
        service.setRollsForRound(1, [3, 5, 9])
        service.setPlayerOut(p1, 1, 2)

        expect(service.playerIsIn(p1, 1)).toBeFalse()
      })

      it('should score a player after they go out', () => {
        service.setRollsForRound(1, [5, 5, 5])
        service.setPlayerOut(p1, 1, 2)
        expect(service.scores[p1]).toBe(15)
      })

      it('should exclude points from after a player goes out', () => {
        service.setRollsForRound(1, [5, 5, 5, 10])
        service.setPlayerOut(p1, 1, 2)
        expect(service.scores[p1]).toBe(15)
      })

      it('should allow a player to be marked as back in', () => {
        service.setRollsForRound(1, [5, 5, 5, 10])
        service.setPlayerOut(p1, 1, 2)
        service.setPlayerBackIn(p1, 1)
        expect(service.scores[p1]).toBe(0)
      })
    })

    describe('Scoring multiple rounds', () => {
      it('should score rounds separately', () => {
        service.setRollsForRound(1, [5, 5, 5])
        service.setRollsForRound(2, [8, 8, 8])
        expect(service.pointsAtStakeInRound(1)).toBe(15)
        expect(service.pointsAtStakeInRound(2)).toBe(24)
      })
    })
  })
})
