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
      update(diceRolls) {
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
    <td>
      <input type="radio"
        x-bind:title="'Mark that '+player+' went out after this roll'"
      >
    </td>
  </template>
  </tr>
</template>
  <tr>
    <td><!--this space intentionally left blank--></td>
    <td>
      <span class="fainter normal-cursor center col2" title="(More rows will appear as needed.)">⏬</span>
    </td>
  <template x-for="player in players">
    <td>
      <button
        (click)="setPlayerBackIn(playerName)"
        class="back-in-button"
        x-bind:title="'Undo marking '+player+' as out'"
        [disabled]="isPlayerStillIn(playerName)">
        Back In
      </button>
    </td>
  </template>
  </tr>
</tbody>

</table>

<template x-init="$watch('diceRolls', () => update(diceRolls))"></template>

<p
  x-show="errorMessage"
  x-text="errorMessage"
  x-bind:style="'max-width:' + $refs.table.offsetWidth + 'px'"
></p>

<!--
<section class="control-grid limit-height" x-bind:style="'--column-count: ' + columnCount">

  <template x-for="(_, index) in diceRolls">
    <div class="roll-input col2" >
      <input type="text" class="roll-input" [formControlName]="iRow" tabindex="10" #rollInput>
    </div>
  </template>

  <template x-for="(_, iRow) in diceRolls">
    <template x-for="(playerName, iPlayer) in players">
      <input type="radio"
        [value]="iRow"
        (click)="refocusNextEmptyRollInput()"
        title="Mark that {{playerName}} went out after this roll"

        x-bind:style="{
          'grid-row': 1 + iRow + 1,
          'grid-column': 2 + iPlayer + 1
        }"
        [formControlName]="playerName">
    </template>
  </template>

  <span class="fainter normal-cursor center col2" title="(More rows will appear as needed.)">⏬</span>

  <button *ngFor="let playerName of players; index as iPlayer"
    (click)="setPlayerBackIn(playerName)"
    class="back-in-button"
    style.grid-row="last"
    [style.grid-column]="2 + iPlayer + 1"
    title="Undo marking {{playerName}} as out"
    [disabled]="isPlayerStillIn(playerName)">
    Back In
  </button>

</section>

<p *ngIf="errorMessage">{{errorMessage}}</p>
-->

<div class="margin-after-round"></div>

</div>
`

customElements.define("round-entry", RoundEntry);
