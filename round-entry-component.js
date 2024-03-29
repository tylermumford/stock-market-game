// Alpine.js is used in this component.
// Docs: https://alpinejs.dev/start-here

class RoundEntry extends HTMLElement {
  connectedCallback() {
    this.round = this.dataset.round;

    Alpine.data('round_' + this.round, this.createReactiveData.bind(this));

    this.render();
  }

  createReactiveData() {
    return {
      round: this.round,
      diceRolls: ['', '', ''],
      // keys are player names, values are roll numbers
      // jane: null means jane isn't out yet
      whenOut: {Jane: null, Sarah: null, Tyler: null},
      errorMessage: '',
      pointsAtStake: 0,

      // Hey, future me: Alpine doesn't automatically
      // make these getters reactive. Heads up.
      get columnCount() {
        const fixedColumnCount = 2
        const dynamicColumnCount = window.Game.players.length
        return fixedColumnCount + dynamicColumnCount;
      },
      // Remember, players are just names.
      get players() {
        return window.Game.players;
      },

      // Updates the game state and properties of the tracked object.
      updateRolls(diceRolls) {
        this.autoExpand();

        let copy = diceRolls.slice();
        copy = copy
          .filter(r => !!r)
          .map(r => r.toUpperCase());

        try {
          window.Game.setRollsForRound(this.round, copy)
          this. pointsAtStake = window.Game.pointsAtStakeInRound(this.round);
          this.errorMessage = "";
        } catch (error) {
          this.errorMessage = error.message;
        }
      },

      // Adds a roll row if all are full, unless last roll is 7.
      autoExpand() {
        let isAllFull = this.diceRolls.every(r => !!r);
        let lastIsSeven = this.diceRolls[this.diceRolls.length - 1] === "7"
        let isPastRollThree = this.diceRolls.length > 3;

        if (isAllFull && !(isPastRollThree && lastIsSeven)) {
          this.diceRolls.push('');
        }
      },

      // Handles players going out/back in
      updateScores() {
        window.Game.players.forEach(playerName => {
          const roundPlayerWentOut = this.whenOut[playerName];
          const isPlayerStillIn = roundPlayerWentOut === null;

          if (isPlayerStillIn) {
            window.Game.setPlayerBackIn(playerName, this.round)
          } else {
            window.Game.setPlayerOut(playerName, this.round, roundPlayerWentOut)
          }
        })
      }
    }
  }

  render() {
    this.innerHTML =
      html
      .replace('x-data="round_1"', `x-data="round_${this.round}"`);
  }
}

const html = `
<div x-data="round_1">
<h3>
  Round <span x-text="round"></span> — <span x-text="pointsAtStake"></span> points at stake
</h3>

<table x-ref="table">

<thead>
  <tr>
  <th>Roll #</th>
  <th>Rolled</th>
<template x-for="player in players">
  <th x-text="player"></th>
</template>
  </tr>
</thead>

<tbody>
<template x-for="(_, index) in diceRolls">
  <tr>
    <td x-text="index + 1"</td>
    <td>
      <input type="text"
        class="roll-input"
        tabIndex="10"
        x-model="diceRolls[index]"
      />
    </td>
  <template x-for="(player, i) in players">
    <td class="center">
      <input type="radio"
        x-bind:title="'Mark that '+player+' went out after this roll'"
        x-bind:value="index"
        x-bind:name="'round:'+round+'_player:'+player"
        x-model.number="whenOut[player]"
      >
    </td>
  </template>
  </tr>
</template>
</tbody>

<tfoot>
  <tr>
    <td><!--this space intentionally left blank--></td>
    <td class="center">
      <span class="fainter normal-cursor center col2" title="(More rows will appear as needed.)">⏬</span>
    </td>
  <template x-for="player in players">
    <td class="center">
      <button
        x-on:click="whenOut[player] = null"
        class="back-in-button"
        x-bind:title="'Undo marking '+player+' as out'"
        x-bind:disabled="whenOut[player] == null">
        Back In
      </button>
    </td>
  </template>
  </tr>
</tfoot>
</table>

<template x-init="$watch('diceRolls', () => updateRolls(diceRolls))"></template>
<template x-init="$watch('whenOut', () => updateScores())"></template>

<p
  x-show="errorMessage"
  x-text="errorMessage"
  x-bind:style="'max-width:' + $refs.table.offsetWidth + 'px'"
></p>

<div class="margin-after-round"></div>

</div>
`

customElements.define("round-entry", RoundEntry);
